// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import {Blake3} from "../libraries/Blake3.sol";
import {Ed25519} from "../libraries/Ed25519.sol";
import {MessageDataVerificationAddAddress} from "./FcMessageDecoder.sol";
import {FcTypeConversion} from "./FcTypeConversion.sol";

library FcMessageVerification {
    error InvalidSignature();

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

    function verifyEthAddressClaim(
        MessageDataVerificationAddAddress memory claim,
        bytes memory signature
    ) public view returns (bool) {
        address target = FcTypeConversion.bytesToAddress(
            claim.verification_add_eth_address_body.address_
        );

        bytes32 structHash = keccak256(
            abi.encode(
                VERIFICATION_CLAIM_TYPEHASH,
                claim.fid,
                target,
                FcTypeConversion.bytesToBytes32(
                    claim.verification_add_eth_address_body.block_hash
                ),
                claim.network
            )
        );

        bytes32 digest = MessageHashUtils.toTypedDataHash(
            _buildDomainSeparator(
                claim.verification_add_eth_address_body.chain_id
            ),
            structHash
        );

        return SignatureChecker.isValidSignatureNow(target, digest, signature);
    }

    function verifyEthAddressClaimAndRevert(
        MessageDataVerificationAddAddress memory claim,
        bytes memory signature
    ) public view {
        if (!verifyEthAddressClaim(claim, signature)) {
            revert InvalidSignature();
        }
    }
}
