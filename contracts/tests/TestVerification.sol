// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../farcaster/FcMessageDecoder.sol";
import "../farcaster/FcMessageVerification.sol";
import "../farcaster/FcTypeConversion.sol";

contract TestVerification {
    event VerificationAddEthAddressBodyVerified(
        uint256 indexed fid,
        address address_,
        bytes eth_signature,
        bytes32 block_hash,
        uint32 verification_type,
        uint32 chain_id,
        uint8 protocol
    );

    function verifyVerificationAddEthAddress(
        bytes32 public_key,
        bytes32 signature_r,
        bytes32 signature_s,
        bytes memory message
    ) external {
        FcMessageVerification.verifyMessageAndRevert(
            public_key,
            signature_r,
            signature_s,
            message
        );

        MessageDataVerificationAddAddress
            memory message_data = FcVerificationDecoder
                .decodeVerificationAddAddress(message);

        FcMessageVerification.verifyEthAddressClaimAndRevert(message_data);

        emit VerificationAddEthAddressBodyVerified(
            message_data.fid,
            bytesToAddress(message_data.verification_add_address_body.address_),
            message_data.verification_add_address_body.claim_signature,
            bytesToBytes32(
                message_data.verification_add_address_body.block_hash
            ),
            message_data.verification_add_address_body.verification_type,
            message_data.verification_add_address_body.chain_id,
            uint8(message_data.verification_add_address_body.protocol)
        );
    }

    event VerificationRemoveBodyVerified(
        uint256 indexed fid,
        address address_,
        uint8 protocol
    );

    function verifyVerificationRemove(
        bytes32 public_key,
        bytes32 signature_r,
        bytes32 signature_s,
        bytes memory message
    ) external {
        FcMessageVerification.verifyMessageAndRevert(
            public_key,
            signature_r,
            signature_s,
            message
        );

        MessageDataVerificationRemove
            memory message_data = FcVerificationDecoder
                .decodeVerificationRemove(message);

        emit VerificationRemoveBodyVerified(
            message_data.fid,
            bytesToAddress(message_data.verification_remove_body.address_),
            uint8(message_data.verification_remove_body.protocol)
        );
    }
}
