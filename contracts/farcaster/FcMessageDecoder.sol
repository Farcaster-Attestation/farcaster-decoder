// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../protobufs/verification.proto.sol";

library FcVerificationDecoder {
    /// @dev Error indicating that the message encoding is invalid.
    error InvalidEncoding();

    /// @dev Error indicating that the message type is invalid.
    /// @param messageType The invalid message type.
    error InvalidMessageType(MessageType messageType);

    /**
     * @notice Decodes a VerificationAddAddress message.
     * @param message The encoded message bytes.
     * @return messageData The decoded message data.
     * @dev This function decodes the provided message and checks for validity.
     * Reverts with `InvalidEncoding` if the decoding fails.
     * Reverts with `InvalidMessageType` if the message type is not `MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS`.
     */
    function decodeVerificationAddAddress(
        bytes memory message
    )
        public
        pure
        returns (MessageDataVerificationAddAddress memory messageData)
    {
        bool success;

        (success, , messageData) = MessageDataVerificationAddAddressCodec
            .decode(0, message, uint64(message.length));

        if (!success) {
            revert InvalidEncoding();
        }

        if (messageData.type_ != MessageType.MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS) {
            revert InvalidMessageType(messageData.type_);
        }
    }

    /**
     * @notice Decodes a VerificationRemove message.
     * @param message The encoded message bytes.
     * @return messageData The decoded message data.
     * @dev This function decodes the provided message and checks for validity.
     * Reverts with `InvalidEncoding` if the decoding fails.
     * Reverts with `InvalidMessageType` if the message type is not `MESSAGE_TYPE_VERIFICATION_REMOVE`.
     */
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
            revert InvalidMessageType(messageData.type_);
        }
    }
}
