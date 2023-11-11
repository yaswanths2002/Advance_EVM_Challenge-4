"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Link, Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  createWallet,
  fundWallet,
  getWalletAddress,
  getWalletBalance,
  transferToWallet,
  withdrawFromWallet,
} from "@/components/interface";

export default function Home() {
  // wallet connect
  const { open, close } = useWeb3Modal();
  const { status, address } = useAccount();

  // States
  const [statusChecked, setStatusChecked] = useState<boolean>(false);
  const [scWallet, setScWallet] = useState<`0x${string}`>();
  const [scWalletBalance, setScWalletBalance] = useState<number>();

  // form states
  type depositForm = { amount: number };
  type withdrawForm = { amount: number };
  type transferForm = { address: string; amount: number };
  const [depositState, setDepositState] = useState<depositForm>({ amount: 0 });
  const [withdrawState, setWithdrawState] = useState<withdrawForm>({
    amount: 0,
  });
  const [transferState, setTransferState] = useState<transferForm>({
    address: "",
    amount: 0,
  });

  // smart contract interactors
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // events and effects
  useEffect(() => {
    setInterval(() => setStatusChecked(true), 2000);
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [address]);

  async function handleRefresh() {
    try {
      setScWallet(await getWalletAddress(publicClient, walletClient));
      let balance = await getWalletBalance(publicClient, walletClient);
      setScWalletBalance(balance ? parseInt(balance.toString()) : undefined);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCreateWallet() {
    await createWallet(publicClient, walletClient);
    await handleRefresh();
  }

  async function handleDeposit() {
    await fundWallet(publicClient, walletClient, depositState.amount);
    await handleRefresh();
    setDepositState({
      amount: 0,
    });
  }

  async function handleWithdraw() {
    await withdrawFromWallet(publicClient, walletClient, withdrawState.amount);
    await handleRefresh();
    setWithdrawState({
      amount: 0,
    });
  }

  async function handleTransfer() {
    await transferToWallet(
      publicClient,
      walletClient,
      transferState.address,
      transferState.amount
    );
    await handleRefresh();
    setTransferState({
      address: "",
      amount: 0,
    });
  }

  return (
    <div className="flex items-center justify-center w-screen min-h-screen">
      <Card className="w-1/2 max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-3xl">Wallet</h2>
            </div>
            <div className="flex gap-3">
              <Button onClick={open}>
                <Link size={20} />
              </Button>
              <Button onClick={handleCreateWallet}>
                <Plus size={20} />
              </Button>
              <Button onClick={handleRefresh}>
                <RefreshCcw size={20} />
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
        </CardHeader>
        <CardContent>
          <h2 className="font-bold text-2xl mb-2">
            {scWalletBalance ? `${scWalletBalance?.toString()} WEI` : "0 WEI"}
          </h2>
          <h4 className="font-semibold text-slate-600">
            {scWallet ? scWallet : "Click the + icon to create account"}
          </h4>

          {/* deposit money */}
          <Separator className="my-4" />
          <p className="text-lg font-bold mb-3">Deposit Money</p>
          <div className="flex gap-3">
            <Input
              className="max-w-xs"
              value={depositState.amount}
              onChange={(e) =>
                setDepositState({ amount: parseInt(e.target.value) })
              }
              placeholder="Enter the amount to deposit"
              type="number"
            />
            <Button onClick={handleDeposit}>Deposit</Button>
          </div>

          {/* withdraw section */}
          <Separator className="my-4" />
          <p className="text-lg font-bold mb-3">Withdraw Money</p>
          <div className="flex gap-3">
            <Input
              className="max-w-xs"
              value={withdrawState.amount}
              onChange={(e) =>
                setWithdrawState({ amount: parseInt(e.target.value) })
              }
              placeholder="Enter the amount to withdraw"
              type="number"
            />
            <Button onClick={handleWithdraw}>Withdraw</Button>
          </div>

          {/* transfer section */}
          <Separator className="my-4" />
          <p className="text-lg font-bold mb-3">Transfer Money</p>
          <Input
            className="max-w-xs mb-3"
            value={transferState.address}
            onChange={(e) =>
              setTransferState({ ...transferState, address: e.target.value })
            }
            placeholder="The address to send the money"
            type="text"
          />
          <Input
            className="max-w-xs mb-3"
            value={transferState.amount}
            onChange={(e) =>
              setTransferState({
                ...transferState,
                amount: parseInt(e.target.value),
              })
            }
            placeholder="The amount to send"
            type="number"
          />
          <Button onClick={handleTransfer}>Transfer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
