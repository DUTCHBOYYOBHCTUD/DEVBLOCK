// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProkenNFT is ERC721URIStorage, Ownable {
    IERC20 public prokenToken;
    uint256 private _tokenIds;

    mapping(uint256 => uint256) public nftPrices;
    mapping(uint256 => bool) public isMinted;

    constructor(address _prokenToken) ERC721("ProkenNFT", "PNFT") Ownable(msg.sender) {
        prokenToken = IERC20(_prokenToken);
    }

    function mintNFT(string memory tokenURI, uint256 price) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _setTokenURI(newItemId, tokenURI);
        nftPrices[newItemId] = price;

        return newItemId;
    }

    function buyNFT(uint256 tokenId) public {
        require(!isMinted[tokenId], "NFT already sold");
        require(nftPrices[tokenId] > 0, "NFT not for sale");

        uint256 price = nftPrices[tokenId];
        require(
            prokenToken.transferFrom(msg.sender, address(this), price),
            "Payment failed"
        );

        _mint(msg.sender, tokenId);
        isMinted[tokenId] = true;
    }

    function withdrawProken(address to, uint256 amount) public onlyOwner {
        require(
            prokenToken.transfer(to, amount),
            "Withdrawal failed"
        );
    }

    function tokenCounter() public view returns (uint256) {
        return _tokenIds;
    }
}
