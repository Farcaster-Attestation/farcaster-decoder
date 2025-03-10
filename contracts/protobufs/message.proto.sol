// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <8.0.0;
pragma experimental ABIEncoderV2;

import "@lazyledger/protobuf3-solidity-lib/contracts/ProtobufLib.sol";

enum HashScheme { HASH_SCHEME_NONE, HASH_SCHEME_BLAKE3 }

enum SignatureScheme { SIGNATURE_SCHEME_NONE, SIGNATURE_SCHEME_ED25519, SIGNATURE_SCHEME_EIP712 }

enum MessageType { MESSAGE_TYPE_NONE, MESSAGE_TYPE_CAST_ADD, MESSAGE_TYPE_CAST_REMOVE, MESSAGE_TYPE_REACTION_ADD, MESSAGE_TYPE_REACTION_REMOVE, MESSAGE_TYPE_LINK_ADD, MESSAGE_TYPE_LINK_REMOVE, MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS, MESSAGE_TYPE_VERIFICATION_REMOVE, MESSAGE_TYPE_SIGNER_ADD, MESSAGE_TYPE_SIGNER_REMOVE, MESSAGE_TYPE_USER_DATA_ADD, MESSAGE_TYPE_USERNAME_PROOF, MESSAGE_TYPE_FRAME_ACTION, MESSAGE_TYPE_LINK_COMPACT_STATE }

enum FarcasterNetwork { FARCASTER_NETWORK_NONE, FARCASTER_NETWORK_MAINNET, FARCASTER_NETWORK_TESTNET, FARCASTER_NETWORK_DEVNET }

enum UserDataType { USER_DATA_TYPE_NONE, USER_DATA_TYPE_PFP, USER_DATA_TYPE_DISPLAY, USER_DATA_TYPE_BIO, UNKNOWN_4, USER_DATA_TYPE_URL, USER_DATA_TYPE_USERNAME }

enum CastType { CAST, LONG_CAST }

enum ReactionType { REACTION_TYPE_NONE, REACTION_TYPE_LIKE, REACTION_TYPE_RECAST }

enum Protocol { PROTOCOL_ETHEREUM, PROTOCOL_SOLANA }

struct VerificationAddAddressBody {
    bytes address_;
    bytes claim_signature;
    bytes block_hash;
    uint32 verification_type;
    uint32 chain_id;
    bool unknown_6;
    Protocol protocol;
}

library VerificationAddAddressBodyCodec {
    function decode(uint64 initial_pos, bytes memory buf, uint64 len) internal pure returns (bool, uint64, VerificationAddAddressBody memory) {
        // Message instance
        VerificationAddAddressBody memory instance;
        // Previous field number
        uint64 previous_field_number = 0;
        // Current position in the buffer
        uint64 pos = initial_pos;

        // Sanity checks
        if (pos + len < pos) {
            return (false, pos, instance);
        }

        while (pos - initial_pos < len) {
            // Decode the key (field number and wire type)
            bool success;
            uint64 field_number;
            ProtobufLib.WireType wire_type;
            (success, pos, field_number, wire_type) = ProtobufLib.decode_key(pos, buf);
            if (!success) {
                return (false, pos, instance);
            }

            // Check that the field number is within bounds
            if (field_number > 7) {
                return (false, pos, instance);
            }

            // Check that the wire type is correct
            success = check_key(field_number, wire_type);
            if (!success) {
                return (false, pos, instance);
            }

            // Actually decode the field
            (success, pos) = decode_field(pos, buf, len, field_number, instance);
            if (!success) {
                return (false, pos, instance);
            }

            previous_field_number = field_number;
        }

        // Decoding must have consumed len bytes
        if (pos != initial_pos + len) {
            return (false, pos, instance);
        }

        return (true, pos, instance);
    }

    function check_key(uint64 field_number, ProtobufLib.WireType wire_type) internal pure returns (bool) {
        if (field_number == 1) {
            return wire_type == ProtobufLib.WireType.LengthDelimited;
        }

        if (field_number == 2) {
            return wire_type == ProtobufLib.WireType.LengthDelimited;
        }

        if (field_number == 3) {
            return wire_type == ProtobufLib.WireType.LengthDelimited;
        }

        if (field_number == 4) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 5) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 6) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 7) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        return false;
    }

    function decode_field(uint64 initial_pos, bytes memory buf, uint64 len, uint64 field_number, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        uint64 pos = initial_pos;

        if (field_number == 1) {
            bool success;
            (success, pos) = decode_1(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        if (field_number == 2) {
            bool success;
            (success, pos) = decode_2(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        if (field_number == 3) {
            bool success;
            (success, pos) = decode_3(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        if (field_number == 4) {
            bool success;
            (success, pos) = decode_4(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        if (field_number == 5) {
            bool success;
            (success, pos) = decode_5(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        if (field_number == 6) {
            bool success;
            (success, pos) = decode_6(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        if (field_number == 7) {
            bool success;
            (success, pos) = decode_7(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        return (false, pos);
    }

    // VerificationAddAddressBody.address_
    function decode_1(uint64 pos, bytes memory buf, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 len;
        (success, pos, len) = ProtobufLib.decode_bytes(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (len == 0) {
            return (false, pos);
        }

        instance.address_ = new bytes(len);
        for (uint64 i = 0; i < len; i++) {
            instance.address_[i] = buf[pos + i];
        }

        pos = pos + len;

        return (true, pos);
    }

    // VerificationAddAddressBody.claim_signature
    function decode_2(uint64 pos, bytes memory buf, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 len;
        (success, pos, len) = ProtobufLib.decode_bytes(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (len == 0) {
            return (false, pos);
        }

        instance.claim_signature = new bytes(len);
        for (uint64 i = 0; i < len; i++) {
            instance.claim_signature[i] = buf[pos + i];
        }

        pos = pos + len;

        return (true, pos);
    }

    // VerificationAddAddressBody.block_hash
    function decode_3(uint64 pos, bytes memory buf, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 len;
        (success, pos, len) = ProtobufLib.decode_bytes(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (len == 0) {
            return (false, pos);
        }

        instance.block_hash = new bytes(len);
        for (uint64 i = 0; i < len; i++) {
            instance.block_hash[i] = buf[pos + i];
        }

        pos = pos + len;

        return (true, pos);
    }

    // VerificationAddAddressBody.verification_type
    function decode_4(uint64 pos, bytes memory buf, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint32 v;
        (success, pos, v) = ProtobufLib.decode_uint32(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (v == 0) {
            return (false, pos);
        }

        instance.verification_type = v;

        return (true, pos);
    }

    // VerificationAddAddressBody.chain_id
    function decode_5(uint64 pos, bytes memory buf, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint32 v;
        (success, pos, v) = ProtobufLib.decode_uint32(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (v == 0) {
            return (false, pos);
        }

        instance.chain_id = v;

        return (true, pos);
    }

    // VerificationAddAddressBody.unknown_6
    function decode_6(uint64 pos, bytes memory buf, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        bool v;
        (success, pos, v) = ProtobufLib.decode_bool(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (v == false) {
            return (false, pos);
        }

        instance.unknown_6 = v;

        return (true, pos);
    }

    // VerificationAddAddressBody.protocol
    function decode_7(uint64 pos, bytes memory buf, VerificationAddAddressBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        int32 v;
        (success, pos, v) = ProtobufLib.decode_enum(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (v == 0) {
            return (false, pos);
        }

        // Check that value is within enum range
        if (v < 0 || v > 1) {
            return (false, pos);
        }

        instance.protocol = Protocol(v);

        return (true, pos);
    }

}

struct VerificationRemoveBody {
    bytes address_;
    Protocol protocol;
}

library VerificationRemoveBodyCodec {
    function decode(uint64 initial_pos, bytes memory buf, uint64 len) internal pure returns (bool, uint64, VerificationRemoveBody memory) {
        // Message instance
        VerificationRemoveBody memory instance;
        // Previous field number
        uint64 previous_field_number = 0;
        // Current position in the buffer
        uint64 pos = initial_pos;

        // Sanity checks
        if (pos + len < pos) {
            return (false, pos, instance);
        }

        while (pos - initial_pos < len) {
            // Decode the key (field number and wire type)
            bool success;
            uint64 field_number;
            ProtobufLib.WireType wire_type;
            (success, pos, field_number, wire_type) = ProtobufLib.decode_key(pos, buf);
            if (!success) {
                return (false, pos, instance);
            }

            // Check that the field number is within bounds
            if (field_number > 2) {
                return (false, pos, instance);
            }

            // Check that the wire type is correct
            success = check_key(field_number, wire_type);
            if (!success) {
                return (false, pos, instance);
            }

            // Actually decode the field
            (success, pos) = decode_field(pos, buf, len, field_number, instance);
            if (!success) {
                return (false, pos, instance);
            }

            previous_field_number = field_number;
        }

        // Decoding must have consumed len bytes
        if (pos != initial_pos + len) {
            return (false, pos, instance);
        }

        return (true, pos, instance);
    }

    function check_key(uint64 field_number, ProtobufLib.WireType wire_type) internal pure returns (bool) {
        if (field_number == 1) {
            return wire_type == ProtobufLib.WireType.LengthDelimited;
        }

        if (field_number == 2) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        return false;
    }

    function decode_field(uint64 initial_pos, bytes memory buf, uint64 len, uint64 field_number, VerificationRemoveBody memory instance) internal pure returns (bool, uint64) {
        uint64 pos = initial_pos;

        if (field_number == 1) {
            bool success;
            (success, pos) = decode_1(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        if (field_number == 2) {
            bool success;
            (success, pos) = decode_2(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        return (false, pos);
    }

    // VerificationRemoveBody.address_
    function decode_1(uint64 pos, bytes memory buf, VerificationRemoveBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 len;
        (success, pos, len) = ProtobufLib.decode_bytes(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (len == 0) {
            return (false, pos);
        }

        instance.address_ = new bytes(len);
        for (uint64 i = 0; i < len; i++) {
            instance.address_[i] = buf[pos + i];
        }

        pos = pos + len;

        return (true, pos);
    }

    // VerificationRemoveBody.protocol
    function decode_2(uint64 pos, bytes memory buf, VerificationRemoveBody memory instance) internal pure returns (bool, uint64) {
        bool success;

        int32 v;
        (success, pos, v) = ProtobufLib.decode_enum(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (v == 0) {
            return (false, pos);
        }

        // Check that value is within enum range
        if (v < 0 || v > 1) {
            return (false, pos);
        }

        instance.protocol = Protocol(v);

        return (true, pos);
    }

}
