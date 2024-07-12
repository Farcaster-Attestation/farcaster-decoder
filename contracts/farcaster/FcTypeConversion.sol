// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

library FcTypeConversion {
    function bytesToAddress(
        bytes memory b
    ) internal pure returns (address payable a) {
        require(b.length == 20);
        assembly {
            a := div(mload(add(b, 32)), exp(256, 12))
        }
    }
}
