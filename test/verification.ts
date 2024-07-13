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

  it("VerificationAddAddress", async () => {
    const alice = privateKeyToAccount(`0x${Buffer.from(randomBytes(32)).toString('hex')}`);
    const eip712Signer: ViemLocalEip712Signer = new ViemLocalEip712Signer(alice as any);
    
    const ed25519Signer = new NobleEd25519Signer(randomBytes(32));

    const blockHash = randomBytes(32)

    const ethSignature = await eip712Signer.signVerificationEthAddressClaim({
      fid: BigInt(fid),
      address: alice.address as `0x${string}`,
      network: FarcasterNetwork.MAINNET,
      blockHash: `0x${Buffer.from(blockHash).toString('hex')}` as `0x${string}`,
      protocol: Protocol.ETHEREUM,
    });

    expect(ethSignature.isOk()).to.be.true

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

    expect(messageResult.isOk()).to.be.true

    const message = messageResult._unsafeUnwrap()

    // console.log(message)

    const messageBytes = (MessageData.encode(message.data).finish());

    {
      const tx = await test.verifyVerificationAddEthAddress(
        message.signer,
        message.signature.subarray(0, 32),
        message.signature.subarray(32),
        messageBytes,
      )
  
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
    }

    {
      expect(
        test.verifyVerificationAddEthAddress(
          message.signer,
          message.signature.subarray(0, 32),
          randomBytes(32),
          messageBytes,
        )
      ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidSignature()");
    }

    {
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
  
      expect(messageResult.isOk()).to.be.true
  
      const message = messageResult._unsafeUnwrap()
      message.data.verificationAddAddressBody.claimSignature = randomBytes(65)
  
      const messageBytes = (MessageData.encode(message.data).finish());

      // console.log(message.data)
      // console.log(Buffer.from(messageBytes).toString('hex'))

      expect(
        test.verifyVerificationAddEthAddress(
          message.signer,
          message.signature.subarray(0, 32),
          message.signature.subarray(32),
          messageBytes,
        )
      ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidSignature()");
    }
  });

  it("VerificationRemove", async () => {
    const alice = privateKeyToAccount(`0x${Buffer.from(randomBytes(32)).toString('hex')}`);

    const ed25519Signer = new NobleEd25519Signer(randomBytes(32));
    
    const messageResult = await makeVerificationRemove(
      {
        address: fromHexString(alice.address),
        protocol: Protocol.ETHEREUM,
      },
      { fid, network: FarcasterNetwork.MAINNET },
      ed25519Signer
    );

    expect(messageResult.isOk()).to.be.true

    const message = messageResult._unsafeUnwrap()
    const messageBytes = (MessageData.encode(message.data).finish());

    {
      const tx = await test.verifyVerificationRemove(
        message.signer,
        message.signature.subarray(0, 32),
        message.signature.subarray(32),
        messageBytes,
      )
  
      await expect(tx)
        .to.emit(test, 'VerificationRemoveBodyVerified')
        .withArgs(
          message.data.fid,
          alice.address,
          Protocol.ETHEREUM,
        );
    }

    {
      expect(
        test.verifyVerificationRemove(
          message.signer,
          message.signature.subarray(0, 32),
          randomBytes(32),
          messageBytes,
        )
      ).to.be.revertedWithCustomError(fcMessageVerification, "InvalidSignature()");
    }
  })
});

