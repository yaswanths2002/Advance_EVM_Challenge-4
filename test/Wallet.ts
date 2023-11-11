import { expect } from "chai";
import { ethers } from "hardhat";

describe("Wallet Factory Contract", () => {

    async function deployStorage() {
        const [owner, addr1, addr2] = await ethers.getSigners();

        const walletFactoryContract = await ethers.deployContract("WalletFactory");
        await walletFactoryContract.waitForDeployment();

        return { walletFactoryContract, owner, addr1, addr2 };
    }

    it("transfer check", async function () {

        const { walletFactoryContract, owner, addr1 } = await deployStorage();

        await walletFactoryContract.createWallet();
        await walletFactoryContract.connect(addr1).createWallet();

        let walletAddr1 = await walletFactoryContract.getWalletAddress();
        let walletAddr2 = await walletFactoryContract.connect(addr1).getWalletAddress();

        console.log(walletAddr1, walletAddr2);

        expect(await walletFactoryContract.getWalletBalance()).to.equal(0);
        await walletFactoryContract.fund({ value: ethers.parseEther("10") });
        expect(await walletFactoryContract.getWalletBalance(), "funding incomplete").to.equal(ethers.parseEther("10"));


        await walletFactoryContract.transfer(walletAddr2, ethers.parseEther("1"));
        expect(await walletFactoryContract.connect(addr1).getWalletBalance(), "transfer error").to.equal(ethers.parseEther("1"));

    })

    it("withdraw check", async function () {
            const { walletFactoryContract, owner } = await deployStorage();

            await walletFactoryContract.createWallet();
            let walletAddr = await walletFactoryContract.getWalletAddress();

            await walletFactoryContract.fund({ value: ethers.parseEther("10") });
            expect(await walletFactoryContract.getWalletBalance(), "funding incomplete").to.equal(ethers.parseEther("10"));

            await walletFactoryContract.withdraw(ethers.parseEther("5"));
            expect(await walletFactoryContract.getWalletBalance(), "withdraw error").to.equal(ethers.parseEther("5"));
        
    })
})