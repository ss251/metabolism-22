import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { NFTPreview, MediaConfiguration } from '@zoralabs/nft-components';
import { Networks, Strategies } from "@zoralabs/nft-hooks"
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json"
import mumbaiZoraAddresses from "@zoralabs/v3/dist/addresses/80001.json"
import zmmABI from "@zoralabs/v3/dist/artifacts/ZoraModuleManager.sol/ZoraModuleManager.json"
import erc721abi from 'erc-token-abis/abis/ERC721Full.json'
import erc20abi from 'erc-token-abis/abis/ERC20Base.json'
import { useAccount, useContractRead, useContractWrite, useSigner } from 'wagmi'
import { Header } from '../components/Header'
import AskRead_disclosure from "../components/Asks/AskRead_disclosure"
import AskWrite_disclosure from '../components/Asks/AskWrite_disclosure';
import OffersRead_disclosure from "../components/Offers/OffersRead_disclosure"
import OffersWrite_disclosure from '../components/Offers/OffersWrite_disclosure';
import AuctionRead_disclosure from "../components/Auctions/AuctionRead_disclosure"
import AuctionWrite_disclosure from '../components/Auctions/AuctionWrite_disclosure'
import { ethers } from 'ethers';

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
}

const API_ENDPOINT = "https://api.zora.co/graphql";
const zdkArgs = { 
  endPoint: API_ENDPOINT, 
  networks: [networkInfo], 
} 

const zdk = new ZDK(zdkArgs) // All arguments are optional  

const zdkStrategyMainnet = new Strategies.ZDKFetchStrategy(
  Networks.MAINNET
)

const Protocol: NextPage = () => {

  interface nftInfo {
    contractAddress: string,
    tokenId: string
  }

  interface nftABIInfo {
    nftABI: any
  }

  const [ asksNFT, setAsksNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "1"
  })

  const [ offersNFT, setOffersNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "2"
  })

  const [ auctionsNFT, setAuctionsNFT] = useState<nftInfo>({
    "contractAddress": "0x7e6663E45Ae5689b313e6498D22B041f4283c88A",
    "tokenId": "3"
  })

  // get account hook
  const { address, connector, isConnecting, isConnected, status} = useAccount(); 
  const currentUserAddress = address ? address : ""

  // ASKS: check if owner has approved ERC721 transfer helper for specific NFT
  const { data: asksRead, isError: asksError, isLoading: asksLoading, isSuccess: asksSuccess, isFetching: asksFetching  } = useContractRead({
    addressOrName: asksNFT.contractAddress,
    contractInterface: erc721abi,
    functionName: 'isApprovedForAll',
    args: [
      currentUserAddress, //owner
      mumbaiZoraAddresses.ERC721TransferHelper // transferhelper
    ],
    watch: false,
    onError(error) {
      console.log("error: ", asksError)
    },
    onSuccess(data) {
      console.log("Asks ERC721TransferHelper Approved? --> ", asksRead)
    }  
  })

  const transferHelperDataBoolAsks = () => {
    return Boolean(asksRead);
  }

  // ASKS: Apporve ERC721TransferHelper as an operator of the specific NFT
  const { data: asksTransferHelperData, isError: asksTransferHelperError, isLoading: asksTransferHelperLoading, isSuccess: asksTransferHelperSuccess, write: asksTransferHelperWrite } = useContractWrite({
    addressOrName: asksNFT.contractAddress,
    contractInterface: erc721abi,
    functionName: 'setApprovalForAll',
    args: [
        mumbaiZoraAddresses.ERC721TransferHelper,
        true,
    ],
    onError(error, variables, context) {
        console.log("error", error)
    },
    onSuccess(cancelData, variables, context) {
        console.log("Success!", asksTransferHelperData)
    },
  })

  // // ASKS: Check allowance of ERC20 token for address
  // const { data: asks20Read, isError: asks20Error, isLoading: asks20Loading, isSuccess: asks20Success, isFetching: asks20Fetching } = useContractRead({
  //   addressOrName: asksNFT.contractAddress,
  //   contractInterface: erc20abi,
  //   functionName: 'allowance',
  //   args: [
  //       currentUserAddress,
  //       mumbaiZoraAddresses.ERC20TransferHelper,
  //   ],
  //   watch: false,
  //   onError(error) {
  //     console.log("error: ", asks20Error)
  //   },
  //   onSuccess(data) {
  //     console.log("ERC20 approved amount === 0? --> ", asks20Read)
  //   }  
  // }) 

  // const allowanceHelperDataBool = () => {
  //   return Boolean(asks20Read);
  // }

  // // ASKS: Apporve ERC20TransferHelper as an operator of the specific NFT
  // const { data: asks20TransferHelperData, isError: asks20TransferHelperError, isLoading: asks20TransferHelperLoading, isSuccess: asks20TransferHelperSuccess, write: asks20TransferHelperWrite } = useContractWrite({
  //   addressOrName: asksNFT.contractAddress,
  //   contractInterface: erc20abi,
  //   functionName: 'approve',
  //   args: [
  //       mumbaiZoraAddresses.ERC20TransferHelper,
  //       ethers.constants.MaxUint256,
  //   ],
  //   onError(error, variables, context) {
  //       console.log("error", error)
  //   },
  //   onSuccess(cancelData, variables, context) {
  //       console.log("Success!", asks20TransferHelperData)
  //   },
  // }) 

  // check if owner has approved Asks Module V1.1
  const { data: zmmAsksBool, isError: zmmAsksError, isLoading: zmmAsksLoading, isSuccess: zmmAsksSuccess, isFetching: zmmAsksFetching  } = useContractRead({
    addressOrName: mumbaiZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'isModuleApproved',
    args: [
      currentUserAddress, //owner
      mumbaiZoraAddresses.AsksV1_1 // AsksV1.1 address
    ],
    watch: false,
    onError(error) {
        console.log("error: ", zmmAsksError)
    },
    onSuccess(data) {
        console.log("AsksV1.1 Module Approved? --> ", zmmAsksBool)
    }  
  })  

  const zmmAsksApprovalCheck = () => {
    return Boolean(zmmAsksBool);
  }

  // ASKS: approve Asks Module
  const { data: asksZMMApproval, isError: asksZMMErrror, isLoading: asksZMMLoading, isSuccess: asksZMMSuccess, write: asksZMMWrite } = useContractWrite({
    addressOrName: mumbaiZoraAddresses.ZoraModuleManager,
    contractInterface: zmmABI.abi,
    functionName: 'setApprovalForModule',
    args: [
        mumbaiZoraAddresses.AsksV1_1,
        true,
    ],
    onError(error, variables, context) {
        console.log("error", error)
    },
    onSuccess(asksZMMApproval, variables, context) {
        console.log("Success!", asksZMMApproval)
    },
  })              

  return (
    <div className='flex flex-col justify-center h-full min-h-screen'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="border-l-2 border-r-2 border-t-2 border-white border-solid text-white grid  grid-rows-3 sm:grid-cols-3 h-fit">        
        
        {/* ASKS MODULE */}
        {/* ASKS MODULE */}
        {/* ASKS MODULE */}

        <div className='mt-24 sm:mt-10 flex flex-row flex-wrap content-start'>
          <div className='h-fit content-start flex flex-row flex-wrap w-full'>
            <div className="text-2xl h-fit w-full flex flex-row justify-center">            
              ASKS MODULE
            </div>
            <div className=" justify-center border-2 border-white border-solid flex flex-row h-fit w-full">
              LIST AND BUY NFTs FOR A SPECIFIC PRICE
            </div>
            <div className="grid grid-cols-2 border-2 boreder-yellow-500 border-solid w-full" >
              <a
                href="https://github.com/0xTranqui/zora-starter-kit"
                className=" hover:cursor-pointer hover:text-[#f53bc3] text-center"
              >
                REPO
              </a>
              <a 
                href="https://etherscan.io/address/0x6170B3C3A54C3d8c854934cBC314eD479b2B29A3"
                className="hover:text-[#f53bc3] text-center"
              >
              ETHERSCAN
              </a>
            </div>
          </div>

          {/* NFT RENDERING + CONTRACT INPUTS */}
          <div className="mt-2  w-full h-fit flex flex-row flex-wrap justify-center "> 
            <MediaConfiguration
              networkId="1"                        
              strategy={zdkStrategyMainnet}
              strings={{
                CARD_OWNED_BY: "",
                CARD_CREATED_BY: "",                           
              }}
              style={{
                theme: {
                  previewCard: {
                    background: "black",
                    height: "200px",
                    width: "200px"                                    
                  },
                  defaultBorderRadius: 0,
                  lineSpacing: 0,
                  textBlockPadding: "0"                
                },              
              }}
            >
              <NFTPreview
                contract={asksNFT.contractAddress}
                id={asksNFT.tokenId}
                showBids={false}
                showPerpetual={false}
              />
            </MediaConfiguration> 
            <div className="w-full flex flex-row flex-wrap justify-center">
              <div className="justify-center flex flex-row w-full">
                <div className="align-center">
                  CONTRACT ADDRESS
                </div>
                <input
                  className="border-[1px] border-solid border-black ml-2 text-black text-center bg-slate-200"
                  placeholder="Input NFT Address"
                  name="inputContract"
                  type="text"
                  value={asksNFT.contractAddress}
                  onChange={(e) => {
                      e.preventDefault();
                      setAsksNFT(current => {
                        return {
                          ...current,
                          contractAddress: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
              <div className="justify-center flex flex-row w-full">
                <div className=" mt-1 self-center">
                  TOKEN ID
                </div>
                <input
                  className="border-l-[1px] border-r-[1px] border-b-[1px] border-solid border-black ml-2 mt-2 flex flex-row align-center text-black text-center bg-slate-200"
                  placeholder="Input Token Id "
                  name="inputContract"
                  type="text"
                  value={asksNFT.tokenId}
                  onChange={(e) => {
                      e.preventDefault();
                      setAsksNFT(current => {
                        return {
                          ...current,
                          tokenId: e.target.value
                        }
                      })
                  }}
                  required                    
                >
                </input>
              </div>
              
              <div className="flex flex-row flex-wrap w-full justify-center">
                {zmmAsksApprovalCheck() === false ? (
                <div className="mt-2 flex w-full justify-center">
                  <button
                    onClick={() => asksZMMWrite()}
                    className="w-fit hover:bg-white hover:text-black border-2 border-white border-solid p-1 mt-1"
                  >
                    APPROVE ASKS MODULE
                  </button>
                </div>
                ) : (
                <div className="mt-2 flex w-full justify-center">
                  <button disabled={true}  className="w-fit border-2 border-slate-600 text-slate-400 border-solid p-1 mt-1">
                    ASK MODULE APPROVED ✅
                  </button>
                </div>                
                )}
                {transferHelperDataBoolAsks() === false ? (
                <div className="mt-2 flex w-full justify-center">
                  <button 
                    onClick={() => asksTransferHelperWrite()}
                    className="w-fit hover:bg-white hover:text-black border-2 border-white border-solid p-1 mt-1"
                  >
                    APPROVE TRANSFER HELPER
                  </button>
                </div>
                ) : (
                <div className="mt-2 flex w-full justify-center">
                  <button disabled={true}  className="w-fit border-2 border-slate-600 text-slate-400 border-solid p-1 mt-1">
                    TRANSFER HELPER APPROVED ✅
                  </button>
                </div>  
                )}
              </div>

            </div>                   
          </div>
          <div className="mt-8 flex flex-row flex-wrap w-full ">
            <div className="w-full">
              <div className="ml-2 mb-2 text-xl">
                ASK MODULE READS
              </div>
              <AskRead_disclosure nft={asksNFT} />
              {/* <AskForNFT_READ nft={asksNFT} /> */}
            </div>
          </div>
          <div className="mt-5 flex flex-row flex-wrap w-full ">
            <div className="flex flex-row flex-wrap w-full">
              <div className="ml-2 mb-2 text-xl">
                ASK MODULE WRITES
              </div>
              <AskWrite_disclosure nft={asksNFT} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Protocol
