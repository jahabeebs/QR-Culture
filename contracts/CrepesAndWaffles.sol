//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrepesAndWaffles is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(bytes32 => bool) private authorizedKeys;

    constructor() public ERC721("Crepes and Waffles", "CREPES") {}

    function generatePermission(bytes32 _key) public onlyOwner {
        authorizedKeys[_key] = true;
    }

    function sendToCustomer(address _customer, string memory _tokenURI, bytes32 _key) public onlyOwner returns (uint256) {
        require(authorizedKeys[_key], "Key not authorized");
        authorizedKeys[_key] = false;
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(_customer, currentTokenId);
        _setTokenURI(currentTokenId, _tokenURI);
        return currentTokenId;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
