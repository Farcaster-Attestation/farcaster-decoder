// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../protobufs/verification.proto.sol";

library MessageDataVerificationDecoder {
    error InvalidEncoding();
    error InvalidMessageType();

    function decodeVerificationAddEthAddress(
        bytes memory message
    )
        public
        pure
        returns (MessageDataVerificationAddEthAddress memory messageData)
    {
        bool success;

        (success, , messageData) = MessageDataVerificationAddEthAddressCodec
            .decode(0, message, uint64(message.length));

        if (!success) {
            revert InvalidEncoding();
        }

        if (messageData.type_ != MessageType.MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS) {
            revert InvalidMessageType();
        }
    }

    function decodeVerificationRemove(
        bytes memory message
    )
        public
        pure
        returns (MessageDataVerificationRemove memory messageData)
    {
        bool success;

        (success, , messageData) = MessageDataVerificationRemoveCodec
            .decode(0, message, uint64(message.length));

        if (!success) {
            revert InvalidEncoding();
        }

        if (messageData.type_ != MessageType.MESSAGE_TYPE_VERIFICATION_REMOVE) {
            revert InvalidMessageType();
        }
    }
}
