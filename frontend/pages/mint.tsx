import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import editionsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useState } from 'react'
import { useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import { BigNumber, ethers } from 'ethers'
import useAppContext from '../context/useAppContext'
import PostMintDialog from '../components/PostMintDialog'

const heavenly = "#40bedc"

const Mint: NextPage = () => {

    const { mintQuantity, setMintQuantity } = useAppContext();

    // ZORA NFT Edition "purchase" write
    const perMintPrice = 0.001;
    const totalMintPrice = String(perMintPrice);
    console.log("totalMintPrice", totalMintPrice);
    const mintValue = BigNumber.from(ethers.utils.parseEther(totalMintPrice)).toString();
    console.log("mintValue", mintValue);

    // totaSupply read call
    const { data: totalSupplyData, isLoading, isSuccess, isFetching } = useContractRead({
        addressOrName: "0x489d0F588Fa4aEEb1b1aB12B2C03Bfe48f06c8Bb", // Zora Land proxy contract
        contractInterface: editionsABI.abi,
        functionName: "totalSupply",
        args: [],
        watch: true,
        onError(error) {
            console.log("error: ", error);
        },
        onSuccess(totalSupplyData) {
            console.log("totalSupply: ", totalSupplyData)
        },
    })

    const totalSupply = totalSupplyData ? totalSupplyData.toString() : "loading" 

    // useContractWrite is a custom hook that allows us to write to a contract
    const { data: mintData, isError: mintError, isLoading: mintLoading, isSuccess: mintSuccess, status: mintStatus, write: mintWrite } = useContractWrite({
        addressOrName: "0x489d0F588Fa4aEEb1b1aB12B2C03Bfe48f06c8Bb",  // Zora Land proxy contract
        contractInterface: editionsABI.abi,
        functionName: 'purchase',
        args: [
            1,
        ],
        overrides: {
            value: mintValue,
        },
        onError(error, variables, context) {
            console.log("error", error)
        },
        onSuccess(cancelData, variables, context) {
            console.log("Success!", cancelData)
        },
    })

    // useWaitForTransaction is a custom hook that allows us to wait for a transaction to be mined
    const { data: mintWaitData, isError: mintWaitError, isLoading: mintWaitLoading } = useWaitForTransaction({
        hash: mintData?.hash,
        onSuccess(mintWaitData) {
            console.log("txn complete: ", mintWaitData)
            console.log("txn hash: ", mintWaitData.transactionHash)
        }
    })


    return (
        <div className='flex flex-col justify-center h-screen min-h-screen bg-transparent'>
            

            <Header />
            <main className="h-full flex flex-col flex-wrap items-center justify-center  ">
                <div className="flex flex-col flex-wrap items-center">
                    <div className={`text-center p-8 mt-5 sm:mt-0 bg-white border-[16px] border-double border-[${heavenly}] font-gothiccc text-5xl sm:text-7xl h-fit w-fit flex flex-row justify-center`} >
                        Zora Land
                    </div>
                    <div className={`mt-10 mb-10 p-8  border-[16px] border-[${heavenly}] border-double bg-white min-w-fit sm:min-w-min  w-8/12 xl:w-6/12 h-fit  `}>
                        <div className="text-center text-4xl h-fit w-full flex flex-row justify-center " >
                            Tokens found in Zora Land
                        </div>
                        <div className="mt-8 w-full flex flex-row justify-center">
                            <button
                                className="flex flex-row justify-self-start  text-2xl  p-3  w-fit h-fit border-2 border-solid border-[#07453a] hover:bg-[#07453a] hover:text-white"
                                onClick={() => mintWrite()}
                            >
                                Mint
                            </button>
                        </div>
                        <PostMintDialog
                            publicTxnLoadingStatus={mintWaitLoading}
                            publicTxnSuccessStatus={mintStatus}
                            publicTxnHashLink={mintWaitData}
                            colorScheme={"#07453a"}
                        />
                        {mintWaitLoading == true ? (
                            <div className="text-xl sm:text-2xl mt-10 flex flex-row flex-wrap justify-center ">
                                <img
                                    className="bg-[#07453a] p-1 rounded-3xl mb-8 w-fit flex flex-row justify-self-center items-center"
                                    width="20px"
                                    src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                                />
                                <div className="w-full text-center">
                                    Mint Price: 0.001 Ξ
                                </div>
                                <div className="w-full text-center">
                                    {`${totalSupply}` + " tokens minted so far"}
                                </div>
                            </div>
                        ) : (
                            <div className="text-xl sm:text-2xl mt-10 flex flex-row flex-wrap justify-center ">
                                <div className="w-full text-center">
                                    Mint Price: 0.001 Ξ
                                </div>
                                <div className="w-full text-center">
                                    {`${totalSupply}` + " tokens minted so far"}
                                </div>
                            </div>
                        )}
                        <Link href="/">
                            <a className="mt-5 text-xl flex flex-row justify-center text-center">
                                ← BACK TO HOME
                            </a>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Mint
