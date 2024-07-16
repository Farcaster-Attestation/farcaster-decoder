import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

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
  const fcMessageVerification = await FcMessageVerification.deploy();

  const FcVerificationDecoder = await ethers.getContractFactory(
    "FcVerificationDecoder"
  );
  const fcVerificationDecoder = await FcVerificationDecoder.deploy();

  const TestVerification = await ethers.getContractFactory(
    "TestVerification",
    {
      libraries: {
        FcMessageVerification: fcMessageVerification.target,
        FcVerificationDecoder: fcVerificationDecoder.target,
      },
    }
  );
  const testVerification = await TestVerification.deploy();

  console.log("Contract deployed to address:", testVerification.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });