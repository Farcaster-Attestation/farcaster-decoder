import {
  FarcasterNetwork,
  MessageData,
  MessageType,
  NobleEd25519Signer,
  ViemLocalEip712Signer,
  makeVerificationAddEthAddress,
  makeVerificationRemove,
} from "@farcaster/core";
import { FcMessageVerification, FcVerificationDecoder, TestVerification } from "../typechain-types";
import { fid, timestamp } from "./constants";
import { ethers } from "hardhat";
import { Protocol } from "../src/protobufs/message";
import { Signer, randomBytes } from "ethers";
import { fromHexString } from "./utils";
import { privateKeyToAccount } from 'viem/accounts';
import { expect } from "chai";

describe("Test ETH address verification", async () => {
  let test: TestVerification;
  let fcMessageVerification: FcMessageVerification;
  let fcVerificationDecoder: FcVerificationDecoder;
  let alice: ReturnType<typeof privateKeyToAccount>;
  let ed25519Signer: NobleEd25519Signer;
  let eip712Signer: ViemLocalEip712Signer;
  let blockHash: Uint8Array;
  let ethSignature: any;

  before(async () => {
    alice = privateKeyToAccount(`0x${Buffer.from(randomBytes(32)).toString('hex')}`);
    eip712Signer = new ViemLocalEip712Signer(alice as any);
    ed25519Signer = new NobleEd25519Signer(randomBytes(32));
    blockHash = randomBytes(32);

    ethSignature = await eip712Signer.signVerificationEthAddressClaim({
      fid: BigInt(fid),
      address: alice.address as `0x${string}`,
      network: FarcasterNetwork.MAINNET,
      blockHash: `0x${Buffer.from(blockHash).toString('hex')}` as `0x${string}`,
      protocol: Protocol.ETHEREUM,
    });
  });

  it("Deploy", async () => {
    const Blake3 = await ethers.getContractFactory("Blake3");
    const blake3 = await Blake3.deploy();

    const Ed25519_pow = await ethers.getContractFactory("Ed25519_pow");
    const ed25519_pow = await Ed25519_pow.deploy();

    const Sha512 = await ethers.getContractFactory("Sha512");
    const sha512 = await Sha512.deploy();

    const Ed25519 = await ethers.getContractFactory("Ed25519", {
      libraries: {
        Ed25519_pow: ed25519_pow.target,
        Sha512: sha512.target,
      },
    });
    const ed25519 = await Ed25519.deploy();

    const FcMessageVerification = await ethers.getContractFactory(
      "FcMessageVerification",
      {
        libraries: {
          Blake3: blake3.target,
          Ed25519: ed25519.target,
        },
      }
    );
    fcMessageVerification = await FcMessageVerification.deploy();

    const FcVerificationDecoder = await ethers.getContractFactory(
      "FcVerificationDecoder"
    );
    fcVerificationDecoder = await FcVerificationDecoder.deploy();

    const TestVerification = await ethers.getContractFactory(
      "TestVerification",
      {
        libraries: {
          FcMessageVerification: fcMessageVerification.target,
          FcVerificationDecoder: fcVerificationDecoder.target,
        },
      }
    );
    test = await TestVerification.deploy();
  });

  it("VerificationAddAddress - Valid case", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    const messageBytes = (MessageData.encode(message.data).finish());

    const tx = await test.verifyVerificationAddEthAddress(
      message.signer,
      message.signature.subarray(0, 32),
      message.signature.subarray(32),
      messageBytes,
    );

    await expect(tx)
      .to.emit(test, 'VerificationAddEthAddressBodyVerified')
      .withArgs(
        message.data.fid,
        alice.address,
        ethSignature._unsafeUnwrap(),
        blockHash,
        0,
        0,
        Protocol.ETHEREUM,
      );
  });

  it("VerificationAddAddress - Invalid signature", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationAddEthAddress(
        message.signer,
        message.signature.subarray(0, 32),
        randomBytes(32), // Invalid signature
        messageBytes,
      )
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidSignature()");
  });

  it("VerificationAddAddress - Invalid claim signature", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the message to have an invalid claim signature
    message.data.verificationAddAddressBody.claimSignature = randomBytes(65);
    const messageBytes = (MessageData.encode(message.data).finish());

    expect(
      await test.verifyVerificationAddEthAddressBody(messageBytes)
    ).to.be.false;
  });

  it("VerificationAddAddress - Invalid protocol", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the protocol to an invalid one
    message.data.verificationAddAddressBody.protocol = Protocol.SOLANA;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationAddEthAddressBody(messageBytes)
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidVerificationProtocol");
  });

  it("VerificationAddAddress - Invalid verification type", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the verification type to an invalid one
    message.data.verificationAddAddressBody.verificationType = 2;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationAddEthAddressBody(messageBytes)
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidVerificationType");
  });

  it("VerificationAddAddress - Invalid Farcaster network", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the network to an invalid one
    message.data.network = FarcasterNetwork.TESTNET;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationAddEthAddressBody(messageBytes)
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidFarcasterNetwork");
  });

  it("VerificationAddAddress - Invalid chain ID for verification type 1", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the verification type and chain ID
    message.data.verificationAddAddressBody.verificationType = 1;
    message.data.verificationAddAddressBody.chainId = 999;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationAddEthAddressBody(messageBytes)
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidVerificationChain");
  });

  it("VerificationAddAddress - Future timestamp", async () => {
    const messageResult = await makeVerificationAddEthAddress(
      {
        address: fromHexString(alice.address),
        blockHash,
        claimSignature: ethSignature._unsafeUnwrap(),
        verificationType: 0,
        chainId: 0,
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually set timestamp to future (current time + 20 minutes in seconds)
    message.data.timestamp = Math.floor(Date.now() / 1000) + 1200;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationAddEthAddressBody(messageBytes)
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidVerificationTimestamp");
  });

  it("VerificationRemove - Valid case", async () => {
    const messageResult = await makeVerificationRemove(
      {
        address: fromHexString(alice.address),
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    const messageBytes = (MessageData.encode(message.data).finish());

    const tx = await test.verifyVerificationRemove(
      message.signer,
      message.signature.subarray(0, 32),
      message.signature.subarray(32),
      messageBytes,
    );

    await expect(tx)
      .to.emit(test, 'VerificationRemoveBodyVerified')
      .withArgs(
        message.data.fid,
        alice.address,
        Protocol.ETHEREUM,
      );
  });

  it("VerificationRemove - Invalid signature", async () => {
    const messageResult = await makeVerificationRemove(
      {
        address: fromHexString(alice.address),
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationRemove(
        message.signer,
        message.signature.subarray(0, 32),
        randomBytes(32), // Invalid signature
        messageBytes,
      )
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidSignature()");
  });

  it("VerificationRemove - Invalid protocol", async () => {
    const messageResult = await makeVerificationRemove(
      {
        address: fromHexString(alice.address),
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the protocol to an invalid one
    message.data.verificationRemoveBody.protocol = Protocol.SOLANA;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationRemoveBody(
        messageBytes,
        alice.address,
        message.data.fid
      )
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidVerificationProtocol");
  });

  it("VerificationRemove - Invalid Farcaster network", async () => {
    const messageResult = await makeVerificationRemove(
      {
        address: fromHexString(alice.address),
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the network to an invalid one
    message.data.network = FarcasterNetwork.TESTNET;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationRemoveBody(
        messageBytes,
        alice.address,
        message.data.fid
      )
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidFarcasterNetwork");
  });

  it("VerificationRemove - Future timestamp", async () => {
    const messageResult = await makeVerificationRemove(
      {
        address: fromHexString(alice.address),
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually set timestamp to future (current time + 20 minutes in seconds)
    message.data.timestamp = Math.floor(Date.now() / 1000) + 1200;
    const messageBytes = (MessageData.encode(message.data).finish());

    await expect(
      test.verifyVerificationRemoveBody(
        messageBytes,
        alice.address,
        message.data.fid
      )
    ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidVerificationTimestamp");
  });

  it("VerificationRemove - Mismatched FID", async () => {
    const messageResult = await makeVerificationRemove(
      {
        address: fromHexString(alice.address),
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true;

    const message = messageResult._unsafeUnwrap();
    // Manually modify the FID to create a mismatch
    message.data.fid = fid + 1;
    const messageBytes = (MessageData.encode(message.data).finish());

    // This should fail the verification check in verifyRemove
    expect(
      await test.verifyVerificationRemoveBody(
        messageBytes,
        alice.address,
        fid
      )
    ).to.be.false;
  });
});
