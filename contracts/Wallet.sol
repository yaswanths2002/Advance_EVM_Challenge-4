// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;


// Created wallet contract 
contract Wallet {
    // Owner of the wallet
    address payable public owner;
    address payable public proxy;
// Constructor that intialize owner and proxy 
    constructor(address _owner) {
        owner = payable(_owner);
        proxy = payable(msg.sender);
    }

    receive() external payable {}

// function fund which is used to accept the incoming ether
    function fund() external payable {}
// Function used to get the adress of  the wallet 
    function getWalletAddress() external view returns (address) {
        return address(this);
    }
// function which displays the balance of the wallet
    function getWalletBalance() external view returns (uint256) {
        return address(this).balance;
    }
// Function used to transfer the amount
    function transfer(uint256 amount) external {
        require(
            address(this).balance >= amount,
            "The required amount is not in the account"
        );
        require(msg.sender == proxy, "Only the proxy can call this function");

        WalletFactory(proxy).getMoney{value: amount}();
    }
// Function used to withdraw the funds
    function withdraw(uint256 amount) external {
        require(
            address(this).balance >= amount,
            "The required amount is not in the account"
        );
        owner.transfer(amount);
    }
}
// Wlletfactory contract 
contract WalletFactory {
    // mapping to store wallets by owner adress
    mapping(address => Wallet) public wallets;
    // Mapping to store wallets by wallet adress
    mapping(address => Wallet) public realAddressWallets;
// Function used to receive ethers
    function getMoney() external payable {}
// declared a modifier used to check waleet is valid or not 
    modifier validWallet() {
        Wallet wallet = wallets[msg.sender];
        require(address(wallet) != address(0), "Wallet does not exist");
        _;
    }
// Function used to receive funds
    receive() external payable {}

    function createWallet() external {
        Wallet wallet = new Wallet(msg.sender);
        address walletAddress = wallet.getWalletAddress();
        realAddressWallets[walletAddress] = wallet;
        wallets[msg.sender] = wallet;
    }
// Function used to fund the wallet
    function fund() external payable validWallet {
        Wallet wallet = wallets[msg.sender];
        wallet.fund{value: msg.value}();
    }
// Function used to transfer the funds
    function transfer(address to, uint256 amount) external validWallet {
        Wallet wallet = wallets[msg.sender];
        wallet.transfer(amount);
        Wallet toWallet = realAddressWallets[to];
        toWallet.fund{value: amount}();
    }
// Function used to withdraw the funds
    function withdraw(uint256 amount) external validWallet {
        Wallet wallet = wallets[msg.sender];
        wallet.withdraw(amount);
    }
// function used to get the wallet address
    function getWalletAddress() external view validWallet returns (address) {
        Wallet wallet = wallets[msg.sender];
        return wallet.getWalletAddress();
    }
// Function used to the balance of the wallet
    function getWalletBalance() external view validWallet returns (uint256) {
        Wallet wallet = wallets[msg.sender];
        return wallet.getWalletBalance();
    }
}
