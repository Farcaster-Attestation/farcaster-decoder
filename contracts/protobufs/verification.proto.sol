// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <8.0.0;
pragma experimental ABIEncoderV2;

import "@lazyledger/protobuf3-solidity-lib/contracts/ProtobufLib.sol";
import "./message.proto.sol";

struct MessageDataVerificationAddAddress {
    MessageType type_;
    uint64 fid;
    uint32 timestamp;
    FarcasterNetwork network;
    bool cast_add_body;
    bool cast_remove_body;
    bool reaction_body;
    bool empty;
    VerificationAddAddressBody verification_add_address_body;
    bool verification_remove_body;
    bool deprecated_signer_add_body;
    bool user_data_body;
    bool deprecated_signer_remove_body;
    bool link_body;
    bool username_proof_body;
    bool frame_action_body;
}

library MessageDataVerificationAddAddressCodec {
    function decode(uint64 initial_pos, bytes memory buf, uint64 len) internal pure returns (bool, uint64, MessageDataVerificationAddAddress memory) {
        // Message instance
        MessageDataVerificationAddAddress memory instance;
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
            if (field_number > 16) {
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
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 2) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 3) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 4) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 9) {
            return wire_type == ProtobufLib.WireType.LengthDelimited;
        }

        return false;
    }

    function decode_field(uint64 initial_pos, bytes memory buf, uint64 len, uint64 field_number, MessageDataVerificationAddAddress memory instance) internal pure returns (bool, uint64) {
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

        if (field_number == 9) {
            bool success;
            (success, pos) = decode_9(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        return (false, pos);
    }

    // MessageDataVerificationAddAddress.type_
    function decode_1(uint64 pos, bytes memory buf, MessageDataVerificationAddAddress memory instance) internal pure returns (bool, uint64) {
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
        if (v < 0 || v > 14) {
            return (false, pos);
        }

        instance.type_ = MessageType(v);

        return (true, pos);
    }

    // MessageDataVerificationAddAddress.fid
    function decode_2(uint64 pos, bytes memory buf, MessageDataVerificationAddAddress memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 v;
        (success, pos, v) = ProtobufLib.decode_uint64(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (v == 0) {
            return (false, pos);
        }

        instance.fid = v;

        return (true, pos);
    }

    // MessageDataVerificationAddAddress.timestamp
    function decode_3(uint64 pos, bytes memory buf, MessageDataVerificationAddAddress memory instance) internal pure returns (bool, uint64) {
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

        instance.timestamp = v;

        return (true, pos);
    }

    // MessageDataVerificationAddAddress.network
    function decode_4(uint64 pos, bytes memory buf, MessageDataVerificationAddAddress memory instance) internal pure returns (bool, uint64) {
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
        if (v < 0 || v > 3) {
            return (false, pos);
        }

        instance.network = FarcasterNetwork(v);

        return (true, pos);
    }

    // MessageDataVerificationAddAddress.verification_add_address_body
    function decode_9(uint64 pos, bytes memory buf, MessageDataVerificationAddAddress memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 len;
        (success, pos, len) = ProtobufLib.decode_embedded_message(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (len == 0) {
            return (false, pos);
        }

        VerificationAddAddressBody memory nestedInstance;
        (success, pos, nestedInstance) = VerificationAddAddressBodyCodec.decode(pos, buf, len);
        if (!success) {
            return (false, pos);
        }

        instance.verification_add_address_body = nestedInstance;

        return (true, pos);
    }

}

struct MessageDataVerificationRemove {
    MessageType type_;
    uint64 fid;
    uint32 timestamp;
    FarcasterNetwork network;
    bool cast_add_body;
    bool cast_remove_body;
    bool reaction_body;
    bool empty;
    bool verification_add_address_body;
    VerificationRemoveBody verification_remove_body;
    bool deprecated_signer_add_body;
    bool user_data_body;
    bool deprecated_signer_remove_body;
    bool link_body;
    bool username_proof_body;
    bool frame_action_body;
}

library MessageDataVerificationRemoveCodec {
    function decode(uint64 initial_pos, bytes memory buf, uint64 len) internal pure returns (bool, uint64, MessageDataVerificationRemove memory) {
        // Message instance
        MessageDataVerificationRemove memory instance;
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
            if (field_number > 16) {
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
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 2) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 3) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 4) {
            return wire_type == ProtobufLib.WireType.Varint;
        }

        if (field_number == 10) {
            return wire_type == ProtobufLib.WireType.LengthDelimited;
        }

        return false;
    }

    function decode_field(uint64 initial_pos, bytes memory buf, uint64 len, uint64 field_number, MessageDataVerificationRemove memory instance) internal pure returns (bool, uint64) {
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

        if (field_number == 10) {
            bool success;
            (success, pos) = decode_10(pos, buf, instance);
            if (!success) {
                return (false, pos);
            }

            return (true, pos);
        }

        return (false, pos);
    }

    // MessageDataVerificationRemove.type_
    function decode_1(uint64 pos, bytes memory buf, MessageDataVerificationRemove memory instance) internal pure returns (bool, uint64) {
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
        if (v < 0 || v > 14) {
            return (false, pos);
        }

        instance.type_ = MessageType(v);

        return (true, pos);
    }

    // MessageDataVerificationRemove.fid
    function decode_2(uint64 pos, bytes memory buf, MessageDataVerificationRemove memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 v;
        (success, pos, v) = ProtobufLib.decode_uint64(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (v == 0) {
            return (false, pos);
        }

        instance.fid = v;

        return (true, pos);
    }

    // MessageDataVerificationRemove.timestamp
    function decode_3(uint64 pos, bytes memory buf, MessageDataVerificationRemove memory instance) internal pure returns (bool, uint64) {
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

        instance.timestamp = v;

        return (true, pos);
    }

    // MessageDataVerificationRemove.network
    function decode_4(uint64 pos, bytes memory buf, MessageDataVerificationRemove memory instance) internal pure returns (bool, uint64) {
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
        if (v < 0 || v > 3) {
            return (false, pos);
        }

        instance.network = FarcasterNetwork(v);

        return (true, pos);
    }

    // MessageDataVerificationRemove.verification_remove_body
    function decode_10(uint64 pos, bytes memory buf, MessageDataVerificationRemove memory instance) internal pure returns (bool, uint64) {
        bool success;

        uint64 len;
        (success, pos, len) = ProtobufLib.decode_embedded_message(pos, buf);
        if (!success) {
            return (false, pos);
        }

        // Default value must be omitted
        if (len == 0) {
            return (false, pos);
        }

        VerificationRemoveBody memory nestedInstance;
        (success, pos, nestedInstance) = VerificationRemoveBodyCodec.decode(pos, buf, len);
        if (!success) {
            return (false, pos);
        }

        instance.verification_remove_body = nestedInstance;

        return (true, pos);
    }

}

