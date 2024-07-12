// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import {Blake3} from "../libraries/Blake3.sol";

import {Ed25519} from "../libraries/Ed25519.sol";

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
        keccak256("EIP712Domain(string name,string version,uint256 chainId,bytes32 salt)");

    bytes32 private constant VERIFICATION_DOMAIN_CHAINLESS =
        keccak256("EIP712Domain(string name,string version,bytes32 salt)");

    bytes32 private constant VERIFICATION_CLAIM_TYPEHASH =
        keccak256("VerificationClaim(uint256 fid,address address,bytes32 blockHash,uint8 network)");

    function verifyEthAddressClaim(
        address ethAddress,
        bytes memory signature
    ) public pure {}
}
