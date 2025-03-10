// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

function bytesToAddress(
    bytes memory b
) pure returns (address payable a) {
    require(b.length == 20);
    assembly {
        a := div(mload(add(b, 32)), exp(256, 12))
    }
}

function bytesToBytes32(bytes memory source) pure returns (bytes32 result) {
    require(source.length == 32, "Source bytes must be exactly 32 bytes long");
    assembly {
        result := mload(add(source, 32))
    }
}
