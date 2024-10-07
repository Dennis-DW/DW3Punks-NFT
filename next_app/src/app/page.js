"use client";
import Image from "next/image";
import { Courier_Prime } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useState } from "react";
import { NFT_CONTRACT_ADDRESS, abi } from "./constants/index";
import { parseEther } from "viem";
import Punks from "./images/dennyspunks.png";

// Importing a font we need
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"] });

export default function Home() {
  // Loading state for when our app is loading something
  const [isLoading, setIsLoading] = useState(false);

  // This hook returns true if the user has connected their wallet and false when they haven't
  const account = useAccount();

  // This executes the tokenIds function in our deployed contract
  const { data: numOfTokensMinted, isLoading: isMintedLoading } = useReadContract({
    abi,
    address: NFT_CONTRACT_ADDRESS,
    functionName: "tokenIds",
  });

  // Hook for writing to a smart contract. It returns a promise that can be awaited
  const { writeContractAsync } = useWriteContract();

  // Function for minting a token
  const mintToken = async () => {
    // Set isLoading to true
    setIsLoading(true);

    try {
      // This executes the mint function present in our deployed contract and sends a value of 0.01 ether to it
      await writeContractAsync(
        {
          abi,
          address: NFT_CONTRACT_ADDRESS,
          functionName: "mint",
          value: parseEther("0.01"),
        },
        {
          onSuccess(result) {
            console.log(result);
          },
        }
      );

      // Shows an alert indicating that the NFT was successfully minted
      window.alert("Successfully minted!");
    } catch (error) {
      console.error(error);
      // Shows an alert indicating that the NFT could not be minted
      window.alert("Could not mint NFT :(");
    }
    // Set isLoading to false
    setIsLoading(false);
  };

  return (
    <main
      className={
        courier.className +
        " flex text-black min-h-screen flex-col items-center justify-center p-24 bg-white"
      }
    >
      <div className="flex w-full">
        <div className="flex flex-col gap-2 w-[60%]">
          <h1 className={"text-4xl"}> Welcome to DW3Punks</h1>
          <h2 className={"text-lg"}>
            It is an NFT collection for Dennys Wamb Practical IPFS.
          </h2>

          <div>
            {/* Displaying the number of minted tokens */}
            {isMintedLoading ? (
              "Loading..."
            ) : (
              `${numOfTokensMinted !== undefined ? parseInt(numOfTokensMinted) : 0}/10 have been minted`
            )}
          </div>

          <div className="mt-1">
            {account ? (
              // If the user has connected their wallet
              <button
                className="bg-blue-500 px-4 py-2 font-sans rounded-md disabled:cursor-not-allowed disabled:bg-blue-900"
                disabled={isLoading}
                onClick={mintToken}
              >
                {isLoading ? "Loading..." : "Mint!"}
              </button>
            ) : (
              // If the user hasn't connected their wallet
              <ConnectButton />
            )}
          </div>
        </div>

        <div className="flex border-2 w-[40%]">
          <Image src={Punks} alt="Punks NFT" />
        </div>
      </div>

      <footer className="absolute bottom-0 w-full text-center mb-4 tracking-wider">
        Made with &#10084; by DW3Punks
      </footer>
    </main>
  );
}

