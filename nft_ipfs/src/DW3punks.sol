// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DW3Punks is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string private _baseTokenURI;
    uint256 public immutable maxTokenIds = 10; // Max supply of tokens
    uint256 public tokenIds; // Tracks the number of minted tokens
    uint256 public price = 0.01 ether; // Price for minting
    bool public paused; // To pause the contract

    event TokenMinted(address indexed minter, uint256 tokenId);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event ContractPaused(bool isPaused);

    modifier onlyWhenNotPaused() {
        require(!paused, "Contract currently paused");
        _;
    }

    constructor(
        string memory baseURI
    ) ERC721("DW3Punks", "DW3P") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    function mint() public payable onlyWhenNotPaused {
        require(tokenIds < maxTokenIds, "Exceed maximum DW3Punks supply");
        require(msg.value >= price, "Ether sent is not correct");

        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);

        emit TokenMinted(msg.sender, tokenIds); // Emit mint event
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function isTokenMinted(uint256 tokenId) public view returns (bool) {
        try this.ownerOf(tokenId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false; // Return false if the token does not exist
        }
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            isTokenMinted(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function setPaused(bool val) public onlyOwner {
        paused = val;
        emit ContractPaused(val); // Emit pause state change event
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Failed to send Ether");

        emit FundsWithdrawn(owner(), amount); // Emit withdrawal event
    }

    receive() external payable {}

    fallback() external payable {}
}
