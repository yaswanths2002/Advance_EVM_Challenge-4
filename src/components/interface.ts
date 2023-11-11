import { PublicClient, WalletClient } from "wagmi";
import data from "./interface.json";

type GetWalletClientResult = WalletClient | null;

async function getWalletAddress(publicClient: PublicClient, walletClient: GetWalletClientResult | undefined) {
    if (!walletClient) {
        console.log("wallets not connected");
        return;
    }

    const [address] = await walletClient.getAddresses();
    
    const result = await publicClient.readContract({
        abi: data.abi,
        address: `0x${data.address.substring(2)}`,
        functionName: "getWalletAddress",
        args: [],
        account: address,
    });

    console.log(result);
    return result as `0x${string}`;
}

async function getWalletBalance(publicClient: PublicClient, walletClient: GetWalletClientResult | undefined) {
    if (!walletClient) {
        console.log("wallets not connected");
        return;
    }

    const [address] = await walletClient.getAddresses();
    
    const result = await publicClient.readContract({
        abi: data.abi,
        address: `0x${data.address.substring(2)}`,
        functionName: "getWalletBalance",
        args: [],
        account: address,
    });

    console.log(result);
    return result as BigInt;
}

async function createWallet(publicClient: PublicClient, walletClient: GetWalletClientResult | undefined) {
    if (!walletClient) {
        console.log("wallets not connected");
        return;
    }

    const [address] = await walletClient.getAddresses();

    const { request } = await publicClient.simulateContract({
        abi: data.abi,
        address: `0x${data.address.substring(2)}`,
        functionName: "createWallet",
        args: [],
        account: address,
    });

    const hash = await walletClient.writeContract(request);
}

async function fundWallet(publicClient: PublicClient, walletClient: GetWalletClientResult | undefined, amount: number) {
    if (!walletClient) {
        console.log("wallets not connected");
        return;
    }

    const [address] = await walletClient.getAddresses();

    const { request } = await publicClient.simulateContract({
        abi: data.abi,
        address: `0x${data.address.substring(2)}`,
        functionName: "fund",
        args: [],
        account: address,
        value: BigInt(amount.toString()),
    });

    const hash = await walletClient.writeContract(request);
}

async function transferToWallet(publicClient: PublicClient, walletClient: GetWalletClientResult | undefined, to: string, amount: number) {
    if (!walletClient) {
        console.log("wallets not connected");
        return;
    }

    const [address] = await walletClient.getAddresses();

    const { request } = await publicClient.simulateContract({
        abi: data.abi,
        address: `0x${data.address.substring(2)}`,
        functionName: "transfer",
        args: [to, amount],
        account: address,
    });

    const hash = await walletClient.writeContract(request);
}

async function withdrawFromWallet(publicClient: PublicClient, walletClient: GetWalletClientResult | undefined, amount: number) {
    if (!walletClient) {
        console.log("wallets not connected");
        return;
    }

    const [address] = await walletClient.getAddresses();

    const { request } = await publicClient.simulateContract({
        abi: data.abi,
        address: `0x${data.address.substring(2)}`,
        functionName: "withdraw",
        args: [amount],
        account: address,
    });

    const hash = await walletClient.writeContract(request);
}

export {
    getWalletAddress,
    getWalletBalance,
    createWallet,
    fundWallet,
    transferToWallet,
    withdrawFromWallet
};
