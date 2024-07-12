/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  FarcasterNetwork,
  farcasterNetworkFromJSON,
  farcasterNetworkToJSON,
  MessageType,
  messageTypeFromJSON,
  messageTypeToJSON,
  VerificationAddAddressBody,
  VerificationRemoveBody,
} from "./message";

/**
 * A MessageData object contains properties common to all messages and wraps a body object which
 * contains properties specific to the MessageType.
 */
export interface MessageDataVerificationAddAddress {
  /** Type of message contained in the body */
  type: MessageType;
  /** Farcaster ID of the user producing the message */
  fid: number;
  /** Farcaster epoch timestamp in seconds */
  timestamp: number;
  /** Farcaster network the message is intended for */
  network: FarcasterNetwork;
  castAddBody: boolean;
  castRemoveBody: boolean;
  reactionBody: boolean;
  empty: boolean;
  verificationAddEthAddressBody: VerificationAddAddressBody | undefined;
  verificationRemoveBody: boolean;
  deprecatedSignerAddBody: boolean;
  userDataBody: boolean;
  deprecatedSignerRemoveBody: boolean;
  linkBody: boolean;
  usernameProofBody: boolean;
  frameActionBody: boolean;
}

/**
 * A MessageData object contains properties common to all messages and wraps a body object which
 * contains properties specific to the MessageType.
 */
export interface MessageDataVerificationRemove {
  /** Type of message contained in the body */
  type: MessageType;
  /** Farcaster ID of the user producing the message */
  fid: number;
  /** Farcaster epoch timestamp in seconds */
  timestamp: number;
  /** Farcaster network the message is intended for */
  network: FarcasterNetwork;
  castAddBody: boolean;
  castRemoveBody: boolean;
  reactionBody: boolean;
  empty: boolean;
  verificationAddEthAddressBody: boolean;
  verificationRemoveBody: VerificationRemoveBody | undefined;
  deprecatedSignerAddBody: boolean;
  userDataBody: boolean;
  deprecatedSignerRemoveBody: boolean;
  linkBody: boolean;
  usernameProofBody: boolean;
  frameActionBody: boolean;
}

function createBaseMessageDataVerificationAddAddress(): MessageDataVerificationAddAddress {
  return {
    type: 0,
    fid: 0,
    timestamp: 0,
    network: 0,
    castAddBody: false,
    castRemoveBody: false,
    reactionBody: false,
    empty: false,
    verificationAddEthAddressBody: undefined,
    verificationRemoveBody: false,
    deprecatedSignerAddBody: false,
    userDataBody: false,
    deprecatedSignerRemoveBody: false,
    linkBody: false,
    usernameProofBody: false,
    frameActionBody: false,
  };
}

export const MessageDataVerificationAddAddress = {
  encode(message: MessageDataVerificationAddAddress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.fid !== 0) {
      writer.uint32(16).uint64(message.fid);
    }
    if (message.timestamp !== 0) {
      writer.uint32(24).uint32(message.timestamp);
    }
    if (message.network !== 0) {
      writer.uint32(32).int32(message.network);
    }
    if (message.castAddBody === true) {
      writer.uint32(40).bool(message.castAddBody);
    }
    if (message.castRemoveBody === true) {
      writer.uint32(48).bool(message.castRemoveBody);
    }
    if (message.reactionBody === true) {
      writer.uint32(56).bool(message.reactionBody);
    }
    if (message.empty === true) {
      writer.uint32(64).bool(message.empty);
    }
    if (message.verificationAddEthAddressBody !== undefined) {
      VerificationAddAddressBody.encode(message.verificationAddEthAddressBody, writer.uint32(74).fork()).ldelim();
    }
    if (message.verificationRemoveBody === true) {
      writer.uint32(80).bool(message.verificationRemoveBody);
    }
    if (message.deprecatedSignerAddBody === true) {
      writer.uint32(88).bool(message.deprecatedSignerAddBody);
    }
    if (message.userDataBody === true) {
      writer.uint32(96).bool(message.userDataBody);
    }
    if (message.deprecatedSignerRemoveBody === true) {
      writer.uint32(104).bool(message.deprecatedSignerRemoveBody);
    }
    if (message.linkBody === true) {
      writer.uint32(112).bool(message.linkBody);
    }
    if (message.usernameProofBody === true) {
      writer.uint32(120).bool(message.usernameProofBody);
    }
    if (message.frameActionBody === true) {
      writer.uint32(128).bool(message.frameActionBody);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageDataVerificationAddAddress {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageDataVerificationAddAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.fid = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.timestamp = reader.uint32();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.network = reader.int32() as any;
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.castAddBody = reader.bool();
          continue;
        case 6:
          if (tag != 48) {
            break;
          }

          message.castRemoveBody = reader.bool();
          continue;
        case 7:
          if (tag != 56) {
            break;
          }

          message.reactionBody = reader.bool();
          continue;
        case 8:
          if (tag != 64) {
            break;
          }

          message.empty = reader.bool();
          continue;
        case 9:
          if (tag != 74) {
            break;
          }

          message.verificationAddEthAddressBody = VerificationAddAddressBody.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag != 80) {
            break;
          }

          message.verificationRemoveBody = reader.bool();
          continue;
        case 11:
          if (tag != 88) {
            break;
          }

          message.deprecatedSignerAddBody = reader.bool();
          continue;
        case 12:
          if (tag != 96) {
            break;
          }

          message.userDataBody = reader.bool();
          continue;
        case 13:
          if (tag != 104) {
            break;
          }

          message.deprecatedSignerRemoveBody = reader.bool();
          continue;
        case 14:
          if (tag != 112) {
            break;
          }

          message.linkBody = reader.bool();
          continue;
        case 15:
          if (tag != 120) {
            break;
          }

          message.usernameProofBody = reader.bool();
          continue;
        case 16:
          if (tag != 128) {
            break;
          }

          message.frameActionBody = reader.bool();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageDataVerificationAddAddress {
    return {
      type: isSet(object.type) ? messageTypeFromJSON(object.type) : 0,
      fid: isSet(object.fid) ? Number(object.fid) : 0,
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
      network: isSet(object.network) ? farcasterNetworkFromJSON(object.network) : 0,
      castAddBody: isSet(object.castAddBody) ? Boolean(object.castAddBody) : false,
      castRemoveBody: isSet(object.castRemoveBody) ? Boolean(object.castRemoveBody) : false,
      reactionBody: isSet(object.reactionBody) ? Boolean(object.reactionBody) : false,
      empty: isSet(object.empty) ? Boolean(object.empty) : false,
      verificationAddEthAddressBody: isSet(object.verificationAddEthAddressBody)
        ? VerificationAddAddressBody.fromJSON(object.verificationAddEthAddressBody)
        : undefined,
      verificationRemoveBody: isSet(object.verificationRemoveBody) ? Boolean(object.verificationRemoveBody) : false,
      deprecatedSignerAddBody: isSet(object.deprecatedSignerAddBody) ? Boolean(object.deprecatedSignerAddBody) : false,
      userDataBody: isSet(object.userDataBody) ? Boolean(object.userDataBody) : false,
      deprecatedSignerRemoveBody: isSet(object.deprecatedSignerRemoveBody)
        ? Boolean(object.deprecatedSignerRemoveBody)
        : false,
      linkBody: isSet(object.linkBody) ? Boolean(object.linkBody) : false,
      usernameProofBody: isSet(object.usernameProofBody) ? Boolean(object.usernameProofBody) : false,
      frameActionBody: isSet(object.frameActionBody) ? Boolean(object.frameActionBody) : false,
    };
  },

  toJSON(message: MessageDataVerificationAddAddress): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = messageTypeToJSON(message.type));
    message.fid !== undefined && (obj.fid = Math.round(message.fid));
    message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
    message.network !== undefined && (obj.network = farcasterNetworkToJSON(message.network));
    message.castAddBody !== undefined && (obj.castAddBody = message.castAddBody);
    message.castRemoveBody !== undefined && (obj.castRemoveBody = message.castRemoveBody);
    message.reactionBody !== undefined && (obj.reactionBody = message.reactionBody);
    message.empty !== undefined && (obj.empty = message.empty);
    message.verificationAddEthAddressBody !== undefined &&
      (obj.verificationAddEthAddressBody = message.verificationAddEthAddressBody
        ? VerificationAddAddressBody.toJSON(message.verificationAddEthAddressBody)
        : undefined);
    message.verificationRemoveBody !== undefined && (obj.verificationRemoveBody = message.verificationRemoveBody);
    message.deprecatedSignerAddBody !== undefined && (obj.deprecatedSignerAddBody = message.deprecatedSignerAddBody);
    message.userDataBody !== undefined && (obj.userDataBody = message.userDataBody);
    message.deprecatedSignerRemoveBody !== undefined &&
      (obj.deprecatedSignerRemoveBody = message.deprecatedSignerRemoveBody);
    message.linkBody !== undefined && (obj.linkBody = message.linkBody);
    message.usernameProofBody !== undefined && (obj.usernameProofBody = message.usernameProofBody);
    message.frameActionBody !== undefined && (obj.frameActionBody = message.frameActionBody);
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageDataVerificationAddAddress>, I>>(
    base?: I,
  ): MessageDataVerificationAddAddress {
    return MessageDataVerificationAddAddress.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MessageDataVerificationAddAddress>, I>>(
    object: I,
  ): MessageDataVerificationAddAddress {
    const message = createBaseMessageDataVerificationAddAddress();
    message.type = object.type ?? 0;
    message.fid = object.fid ?? 0;
    message.timestamp = object.timestamp ?? 0;
    message.network = object.network ?? 0;
    message.castAddBody = object.castAddBody ?? false;
    message.castRemoveBody = object.castRemoveBody ?? false;
    message.reactionBody = object.reactionBody ?? false;
    message.empty = object.empty ?? false;
    message.verificationAddEthAddressBody =
      (object.verificationAddEthAddressBody !== undefined && object.verificationAddEthAddressBody !== null)
        ? VerificationAddAddressBody.fromPartial(object.verificationAddEthAddressBody)
        : undefined;
    message.verificationRemoveBody = object.verificationRemoveBody ?? false;
    message.deprecatedSignerAddBody = object.deprecatedSignerAddBody ?? false;
    message.userDataBody = object.userDataBody ?? false;
    message.deprecatedSignerRemoveBody = object.deprecatedSignerRemoveBody ?? false;
    message.linkBody = object.linkBody ?? false;
    message.usernameProofBody = object.usernameProofBody ?? false;
    message.frameActionBody = object.frameActionBody ?? false;
    return message;
  },
};

function createBaseMessageDataVerificationRemove(): MessageDataVerificationRemove {
  return {
    type: 0,
    fid: 0,
    timestamp: 0,
    network: 0,
    castAddBody: false,
    castRemoveBody: false,
    reactionBody: false,
    empty: false,
    verificationAddEthAddressBody: false,
    verificationRemoveBody: undefined,
    deprecatedSignerAddBody: false,
    userDataBody: false,
    deprecatedSignerRemoveBody: false,
    linkBody: false,
    usernameProofBody: false,
    frameActionBody: false,
  };
}

export const MessageDataVerificationRemove = {
  encode(message: MessageDataVerificationRemove, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.fid !== 0) {
      writer.uint32(16).uint64(message.fid);
    }
    if (message.timestamp !== 0) {
      writer.uint32(24).uint32(message.timestamp);
    }
    if (message.network !== 0) {
      writer.uint32(32).int32(message.network);
    }
    if (message.castAddBody === true) {
      writer.uint32(40).bool(message.castAddBody);
    }
    if (message.castRemoveBody === true) {
      writer.uint32(48).bool(message.castRemoveBody);
    }
    if (message.reactionBody === true) {
      writer.uint32(56).bool(message.reactionBody);
    }
    if (message.empty === true) {
      writer.uint32(64).bool(message.empty);
    }
    if (message.verificationAddEthAddressBody === true) {
      writer.uint32(72).bool(message.verificationAddEthAddressBody);
    }
    if (message.verificationRemoveBody !== undefined) {
      VerificationRemoveBody.encode(message.verificationRemoveBody, writer.uint32(82).fork()).ldelim();
    }
    if (message.deprecatedSignerAddBody === true) {
      writer.uint32(88).bool(message.deprecatedSignerAddBody);
    }
    if (message.userDataBody === true) {
      writer.uint32(96).bool(message.userDataBody);
    }
    if (message.deprecatedSignerRemoveBody === true) {
      writer.uint32(104).bool(message.deprecatedSignerRemoveBody);
    }
    if (message.linkBody === true) {
      writer.uint32(112).bool(message.linkBody);
    }
    if (message.usernameProofBody === true) {
      writer.uint32(120).bool(message.usernameProofBody);
    }
    if (message.frameActionBody === true) {
      writer.uint32(128).bool(message.frameActionBody);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageDataVerificationRemove {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageDataVerificationRemove();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.fid = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.timestamp = reader.uint32();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.network = reader.int32() as any;
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.castAddBody = reader.bool();
          continue;
        case 6:
          if (tag != 48) {
            break;
          }

          message.castRemoveBody = reader.bool();
          continue;
        case 7:
          if (tag != 56) {
            break;
          }

          message.reactionBody = reader.bool();
          continue;
        case 8:
          if (tag != 64) {
            break;
          }

          message.empty = reader.bool();
          continue;
        case 9:
          if (tag != 72) {
            break;
          }

          message.verificationAddEthAddressBody = reader.bool();
          continue;
        case 10:
          if (tag != 82) {
            break;
          }

          message.verificationRemoveBody = VerificationRemoveBody.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag != 88) {
            break;
          }

          message.deprecatedSignerAddBody = reader.bool();
          continue;
        case 12:
          if (tag != 96) {
            break;
          }

          message.userDataBody = reader.bool();
          continue;
        case 13:
          if (tag != 104) {
            break;
          }

          message.deprecatedSignerRemoveBody = reader.bool();
          continue;
        case 14:
          if (tag != 112) {
            break;
          }

          message.linkBody = reader.bool();
          continue;
        case 15:
          if (tag != 120) {
            break;
          }

          message.usernameProofBody = reader.bool();
          continue;
        case 16:
          if (tag != 128) {
            break;
          }

          message.frameActionBody = reader.bool();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageDataVerificationRemove {
    return {
      type: isSet(object.type) ? messageTypeFromJSON(object.type) : 0,
      fid: isSet(object.fid) ? Number(object.fid) : 0,
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
      network: isSet(object.network) ? farcasterNetworkFromJSON(object.network) : 0,
      castAddBody: isSet(object.castAddBody) ? Boolean(object.castAddBody) : false,
      castRemoveBody: isSet(object.castRemoveBody) ? Boolean(object.castRemoveBody) : false,
      reactionBody: isSet(object.reactionBody) ? Boolean(object.reactionBody) : false,
      empty: isSet(object.empty) ? Boolean(object.empty) : false,
      verificationAddEthAddressBody: isSet(object.verificationAddEthAddressBody)
        ? Boolean(object.verificationAddEthAddressBody)
        : false,
      verificationRemoveBody: isSet(object.verificationRemoveBody)
        ? VerificationRemoveBody.fromJSON(object.verificationRemoveBody)
        : undefined,
      deprecatedSignerAddBody: isSet(object.deprecatedSignerAddBody) ? Boolean(object.deprecatedSignerAddBody) : false,
      userDataBody: isSet(object.userDataBody) ? Boolean(object.userDataBody) : false,
      deprecatedSignerRemoveBody: isSet(object.deprecatedSignerRemoveBody)
        ? Boolean(object.deprecatedSignerRemoveBody)
        : false,
      linkBody: isSet(object.linkBody) ? Boolean(object.linkBody) : false,
      usernameProofBody: isSet(object.usernameProofBody) ? Boolean(object.usernameProofBody) : false,
      frameActionBody: isSet(object.frameActionBody) ? Boolean(object.frameActionBody) : false,
    };
  },

  toJSON(message: MessageDataVerificationRemove): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = messageTypeToJSON(message.type));
    message.fid !== undefined && (obj.fid = Math.round(message.fid));
    message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
    message.network !== undefined && (obj.network = farcasterNetworkToJSON(message.network));
    message.castAddBody !== undefined && (obj.castAddBody = message.castAddBody);
    message.castRemoveBody !== undefined && (obj.castRemoveBody = message.castRemoveBody);
    message.reactionBody !== undefined && (obj.reactionBody = message.reactionBody);
    message.empty !== undefined && (obj.empty = message.empty);
    message.verificationAddEthAddressBody !== undefined &&
      (obj.verificationAddEthAddressBody = message.verificationAddEthAddressBody);
    message.verificationRemoveBody !== undefined && (obj.verificationRemoveBody = message.verificationRemoveBody
      ? VerificationRemoveBody.toJSON(message.verificationRemoveBody)
      : undefined);
    message.deprecatedSignerAddBody !== undefined && (obj.deprecatedSignerAddBody = message.deprecatedSignerAddBody);
    message.userDataBody !== undefined && (obj.userDataBody = message.userDataBody);
    message.deprecatedSignerRemoveBody !== undefined &&
      (obj.deprecatedSignerRemoveBody = message.deprecatedSignerRemoveBody);
    message.linkBody !== undefined && (obj.linkBody = message.linkBody);
    message.usernameProofBody !== undefined && (obj.usernameProofBody = message.usernameProofBody);
    message.frameActionBody !== undefined && (obj.frameActionBody = message.frameActionBody);
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageDataVerificationRemove>, I>>(base?: I): MessageDataVerificationRemove {
    return MessageDataVerificationRemove.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MessageDataVerificationRemove>, I>>(
    object: I,
  ): MessageDataVerificationRemove {
    const message = createBaseMessageDataVerificationRemove();
    message.type = object.type ?? 0;
    message.fid = object.fid ?? 0;
    message.timestamp = object.timestamp ?? 0;
    message.network = object.network ?? 0;
    message.castAddBody = object.castAddBody ?? false;
    message.castRemoveBody = object.castRemoveBody ?? false;
    message.reactionBody = object.reactionBody ?? false;
    message.empty = object.empty ?? false;
    message.verificationAddEthAddressBody = object.verificationAddEthAddressBody ?? false;
    message.verificationRemoveBody =
      (object.verificationRemoveBody !== undefined && object.verificationRemoveBody !== null)
        ? VerificationRemoveBody.fromPartial(object.verificationRemoveBody)
        : undefined;
    message.deprecatedSignerAddBody = object.deprecatedSignerAddBody ?? false;
    message.userDataBody = object.userDataBody ?? false;
    message.deprecatedSignerRemoveBody = object.deprecatedSignerRemoveBody ?? false;
    message.linkBody = object.linkBody ?? false;
    message.usernameProofBody = object.usernameProofBody ?? false;
    message.frameActionBody = object.frameActionBody ?? false;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
