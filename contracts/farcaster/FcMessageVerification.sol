// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import {Blake3} from "../libraries/Blake3.sol";
import {Ed25519} from "../libraries/Ed25519.sol";
import {MessageDataVerificationAddAddress, Protocol} from "./FcMessageDecoder.sol";
import "./FcTypeConversion.sol";

library FcMessageVerification {
    /// @dev Error indicating that the signature is invalid.
    error InvalidSignature();

    /// @dev Error indicating that the verification protocol is invalid.
    /// @param protocol The invalid protocol.
    error InvalidVerificationProtocol(Protocol protocol);

    /// @dev Error indicating that the verification chain ID is invalid.
    /// @param chainId The invalid chain ID.
    error InvalidVerificationChain(uint256 chainId);

    /**
     * @notice Verifies the given message using Ed25519 signature scheme.
     * @param public_key The public key used for verification.
     * @param signature_r The R component of the signature.
     * @param signature_s The S component of the signature.
     * @param message The message to verify.
     * @return True if the signature is valid, false otherwise.
     */
    function verifyMessage(
        bytes32 public_key,
        bytes32 signature_r,
        bytes32 signature_s,
        bytes memory message
    ) public pure returns (bool) {
        // Calculate Blake3 hash of FC message (first 20 bytes)
        bytes memory message_hash = Blake3.hash(message, 20);

        // Verify signature
        return
            Ed25519.verify(public_key, signature_r, signature_s, message_hash);
    }

    /**
     * @notice Verifies the given message and reverts if the signature is invalid.
     * @param public_key The public key used for verification.
     * @param signature_r The R component of the signature.
     * @param signature_s The S component of the signature.
     * @param message The message to verify.
     * @dev Reverts with `InvalidSignature` if the signature is invalid.
     */
    function verifyMessageAndRevert(
        bytes32 public_key,
        bytes32 signature_r,
        bytes32 signature_s,
        bytes memory message
    ) public pure {
        if (!verifyMessage(public_key, signature_r, signature_s, message)) {
            revert InvalidSignature();
        }
    }

    bytes32 private constant VERIFICATION_DOMAIN =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,bytes32 salt)"
        );

    bytes32 private constant VERIFICATION_DOMAIN_CHAINLESS =
        keccak256("EIP712Domain(string name,string version,bytes32 salt)");

    bytes32 private constant VERIFICATION_DOMAIN_NAME =
        keccak256("Farcaster Verify Ethereum Address");
    bytes32 private constant VERIFICATION_DOMAIN_VERSION = keccak256("2.0.0");
    bytes32 private constant VERIFICATION_DOMAIN_SALT =
        0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558;

    bytes32 private constant VERIFICATION_DOMAIN_SEPERATOR_CHAINLESS =
        keccak256(
            abi.encode(
                VERIFICATION_DOMAIN_CHAINLESS,
                VERIFICATION_DOMAIN_NAME,
                VERIFICATION_DOMAIN_VERSION,
                VERIFICATION_DOMAIN_SALT
            )
        );

    bytes32 private constant VERIFICATION_CLAIM_TYPEHASH =
        keccak256(
            "VerificationClaim(uint256 fid,address address,bytes32 blockHash,uint8 network)"
        );

    /**
     * @notice Builds the wallet verification domain separator for EIP-712.
     * @param chainId The chain ID.
     * @return The domain separator.
     */
    function _buildDomainSeparator(
        uint256 chainId
    ) private pure returns (bytes32) {
        if (chainId == 0) return VERIFICATION_DOMAIN_SEPERATOR_CHAINLESS;
        return
            keccak256(
                abi.encode(
                    VERIFICATION_DOMAIN,
                    VERIFICATION_DOMAIN_NAME,
                    VERIFICATION_DOMAIN_VERSION,
                    chainId,
                    VERIFICATION_DOMAIN_SALT
                )
            );
    }

    /**
     * @notice Verifies an Ethereum address claim.
     * @param claim The claim data to verify.
     * @return True if the claim is valid, false otherwise.
     * @dev Reverts with `InvalidVerificationProtocol` if the protocol is not Ethereum.
     * Reverts with `InvalidVerificationChain` if the chain ID is invalid.
     */
    function verifyEthAddressClaim(
        MessageDataVerificationAddAddress memory claim
    ) public view returns (bool) {
        if (claim.verification_add_address_body.protocol != Protocol.PROTOCOL_ETHEREUM) {
            revert InvalidVerificationProtocol(claim.verification_add_address_body.protocol);
        }

        if (claim.verification_add_address_body.chain_id != 0 && claim.verification_add_address_body.chain_id != block.chainid) {
            revert InvalidVerificationChain(claim.verification_add_address_body.chain_id);
        }

        if (claim.verification_add_address_body.verification_type == 1 && claim.verification_add_address_body.chain_id != block.chainid) {
            revert InvalidVerificationChain(claim.verification_add_address_body.chain_id);
        }

        address target = bytesToAddress(
            claim.verification_add_address_body.address_
        );

        bytes32 structHash = keccak256(
            abi.encode(
                VERIFICATION_CLAIM_TYPEHASH,
                claim.fid,
                target,
                bytesToBytes32(claim.verification_add_address_body.block_hash),
                claim.network
            )
        );

        bytes32 digest = MessageHashUtils.toTypedDataHash(
            _buildDomainSeparator(claim.verification_add_address_body.chain_id),
            structHash
        );

        return
            SignatureChecker.isValidSignatureNow(
                target,
                digest,
                claim.verification_add_address_body.claim_signature
            );
    }

    /**
     * @notice Verifies an Ethereum address claim and reverts if invalid.
     * @param claim The claim data to verify.
     * @dev Reverts with `InvalidSignature` if the claim is invalid.
     * Reverts with `InvalidVerificationProtocol` if the protocol is not Ethereum.
     * Reverts with `InvalidVerificationChain` if the chain ID is invalid.
     */
    function verifyEthAddressClaimAndRevert(
        MessageDataVerificationAddAddress memory claim
    ) public view {
        if (!verifyEthAddressClaim(claim)) {
            revert InvalidSignature();
        }
    }
}
