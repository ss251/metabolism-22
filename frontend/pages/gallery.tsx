import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'
import {
  Network,
  Alchemy,
  BaseNft,
  NftTokenType,
  NftExcludeFilters
} from "alchemy-sdk";
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useEffect, useState } from 'react';
import Card from '../components/card';




const Gallery: NextPage = () => {
  const { chain } = useNetwork();
  const [NFTs, setNFTs] = useState([]);

  let net;

  console.log(chain)

  if (chain?.id === 1) {
    net = Network.ETH_MAINNET;
  }

  if (chain?.id === 4) {
    net = Network.ETH_RINKEBY;
  }

  if (chain?.id === 80001) {
    net = Network.MATIC_MUMBAI;
  }

  // Optional Config object, but defaults to demo api-key and eth-mainnet.
  const settings = {
    apiKey: process.env.NEXT_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: net, // Replace with your network.
    maxRetries: 10,
  };

  const alchemy = new Alchemy(settings);

  const { address } = useAccount();
  
  const fetchNFTs = () => alchemy.nft.getNftsForOwner(address).then(nfts => {
    setNFTs(nfts.ownedNfts);
    console.log(nfts);
  });

  useEffect(() => {
    if (address) {
      fetchNFTs();
    }
  }, [address, chain]);

  return (
    <div className='min-h-screen bg-transparent'>

      <Header/>
      
        {/* <h1 className="text-white">
          <button onClick={() => fetchNFTs()}>Fetch</button>
        </h1> */}
        {NFTs && <div className='flex flex-wrap justify-center mt-12 '>
                {
                    NFTs ? NFTs.map((NFT, i)=> {
                       
                        return (
                           <Card key={i} image={NFT.media[0]?.raw} id={NFT.tokenId } title={NFT.title} address={NFT.contract.address} description={NFT.description} ></Card>
                        )
                    }) : <div>No NFTs found</div>
                }
            </div>}
      
      
      
    </div>
  )
}

export default Gallery
