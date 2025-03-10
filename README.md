# Farcaster Resolver Message Decoder and Verifier

A set of Solidity libraries for verifying and parsing Farcaster wallet verification messages onchain. Modified from the original [farcaster-solidity](https://github.com/pavlovdog/farcaster-solidity) library made by [fastfourier.eth](https://warpcast.com/fastfourier.eth).

This library has been refactored to exclusively support Farcaster wallet verification messages, thereby reducing nSLOC and minimizing the attack surface from unwanted message decoding.

## Introduction

The difference between a Farcaster and many other social networks is the cryptographic protocol that allows any user to verify any action, that happened on the network. Using cryptographic signatures and an onchain key registry, it is possible to verify the correctness of the cast, like, the following relation, etc.

The goal of this project is to provide a set of Solidity libraries and examples, helping to verify and parse Farcaster wallet verification messages on-chain.

## Overview

Farcaster messages (cast, like, following, etc) are represented as Protobuf messages, signed with the user's private key. Here's an illustration of what happens when a new cast is sent to the Farcaster network:

1. Alice publishes a cast. Application (eg Warpcast) forms a message from text, mentions, links, etc
2. The message is encoded using the Protobuf scheme into a series of bytes. Then it gets hashed using the Blake3 hash function, and the first 20 bytes of the hash are signed with the user's Ed25519 private key. The corresponding public key is stored in a smart contract called `KeyRegistry` on Optimism Mainnet.
3. The message and the signature, are being sent to the network
4. Each network participant verifies, that the signature is correct and accepts the message as valid.

All these actions can be done inside the smart contract, verifying that Alice indeed sent the message!

**Farcaster wallet verification and remove is being done in a similar way!**

## Usage example

The full example can be found at [contracts/tests/TestVerification.sol](./contracts/tests/TestVerification.sol) and [the unit test](./test/verification.ts).

## Running locally

```bash
yarn
yarn hh:compile
yarn hh:test
# Get contract's size in kb
yarn hh:size
```

### Modifying proto schemes

To modify .proto schemes, install our modified [protobuf3-solidity](https://github.com/Farcaster-Attestation/protobuf3-solidity).

```
git clone https://github.com/Farcaster-Attestation/protobuf3-solidity
cd protobuf3-solidity
make
```

Export the path to the binary and run `yarn protoc` to update Solidity libraries and TS definitions

```bash
export PROTO_GEN_SOL=./../protobuf3-solidity/bin/protoc-gen-sol
cd farcaster-decoder
yarn protoc
```

Keep in mind, that the [original protobuf3-solidity](https://github.com/celestiaorg/protobuf3-solidity) does not support all Protobuf features (`oneOf` fields, repeated strings, non-packed repeated fields). Another important thing is that message fields should be enumerated in a strict incremental order.

Since the Farcaster message protobuf heavily relies on `oneOf`, we have to modify the protobuf3 solidity compiler to support this feature.

## Links & credits

- [Original farcaster-solidity library](https://github.com/pavlovdog/farcaster-solidity)
- [Blake3 Solidity implementation](https://github.com/mel-project/blake3-sol)
- [Ed25519 Solidity implementation](https://github.com/chengwenxi/Ed25519)
- [Original protobuf3-solidity](https://github.com/celestiaorg/protobuf3-solidity)
- [@farcaster/core](https://github.com/farcasterxyz/hub-monorepo/tree/main/packages/core) (contains .proto files)
- [Farcaster specification](https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md)
