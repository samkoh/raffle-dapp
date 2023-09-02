// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract LotteryContract {
    address public admin;
    mapping(address => uint256) public entryCounts;
    address[] public players;
    address[] public playerSelector;
    bool public lotteryStatus;
    uint256 public ticketCost;
    address public nftContract;
    uint256 public tokenId;
    uint256 public totalEntries;

    event NewTicketBought(address player);
    event LotteryStarted();
    event LotteryEnded();
    event Winner(address winner);
    event TicketCostChanged(uint256 newCost);
    event NFTPrizeSet(address nftContract, uint256 tokenId);
    event BalanceWithdrawn(uint256 amount);

    constructor(uint256 _ticketCost) {
        admin = msg.sender;
        lotteryStatus = false;
        ticketCost = _ticketCost;
        totalEntries = 0;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function isPlayer(address participant) private view returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == participant) {
                return true;
            }
        }
        return false;
    }

    function buyTicket(uint256 numberOfTickets) public payable {
        require(lotteryStatus == true, "Lottery is not running");
        require(
            msg.value == ticketCost * numberOfTickets,
            "Ticket cost is incorrect"
        );

        entryCounts[msg.sender] += numberOfTickets;
        totalEntries += numberOfTickets;

        if (!isPlayer(msg.sender)) {
            players.push(msg.sender);
        }

        for (uint256 i = 0; i < numberOfTickets; i++) {
            playerSelector.push(msg.sender);
        }

        emit NewTicketBought(msg.sender);
    }

    function startLottery(
        address _nftContract,
        uint256 _tokenId
    ) public onlyAdmin {
        require(!lotteryStatus, "Lottery is already running");
        require(
            nftContract == address(0),
            "Prize from previous lottery is not tranferred"
        );
        require(
            ERC721Base(_nftContract).ownerOf(_tokenId) == admin,
            "Admin does not own the specified NFT"
        );

        nftContract = _nftContract;
        tokenId = _tokenId;
        lotteryStatus = true;
        emit LotteryStarted();
        emit NFTPrizeSet(nftContract, tokenId);
    }

    function endLottery() public onlyAdmin {
        require(lotteryStatus, "Lottery is not running");

        lotteryStatus = false;
        emit LotteryEnded();
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.prevrandao,
                        block.timestamp,
                        players.length
                    )
                )
            );
    }

    function resetEntryCount() private {
        for (uint256 i = 0; i < players.length; i++) {
            entryCounts[players[i]] = 0;
        }
    }

    function pickWinner() public onlyAdmin {
        require(!lotteryStatus, "Lottery is still running");
        require(playerSelector.length > 0, "No players in the lottery");
        require(nftContract != address(0), "NFT contract not set");

        uint256 index = random() % playerSelector.length;
        address winner = playerSelector[index];
        emit Winner(winner);

        ERC721Base(nftContract).transferFrom(admin, winner, tokenId);

        resetEntryCount();

        delete playerSelector;
        delete players;
        lotteryStatus = false;
        nftContract = address(0);
        tokenId = 0;
        totalEntries = 0;
    }

    function changeTicketCost(uint256 _newCost) public onlyAdmin {
        require(!lotteryStatus, "Lottery is still running");

        ticketCost = _newCost;
        emit TicketCostChanged(_newCost);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    // return contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawBalance() public onlyAdmin {
        require(address(this).balance > 0, "No balance to withdraw");
        uint256 amount = address(this).balance;
        payable(admin).transfer(amount);
        emit BalanceWithdrawn(amount);
    }

    // reset the contract
    function resetContract() public onlyAdmin {
        delete playerSelector;
        delete players;
        lotteryStatus = false;
        nftContract = address(0);
        tokenId = 0;
        ticketCost = 0;
        totalEntries = 0;
        resetEntryCount();
    }
}
