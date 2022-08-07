import React, { useState } from "react";
import { Web3Storage } from "web3.storage";
import ZoraLand from "../utils/ZoraLand.json";
import { useRouter } from "next/router";
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { ethers } from "ethers";
import { Header } from "../components/Header";


export default function Create() {
  // @ts-ignore 
const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_API_KEY });
    const { address } = useAccount();
  
  const [imgFileUrl, setImgFileUrl] = useState(null);
  const [animationFileUrl, setAnimationFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: "",
    symbol: "",
    description: "",
    image: "",
    animation_url: "",
  });
  const router = useRouter();

  async function onSubmit(e) {
    const { ethereum } = window;
    const ABI = ZoraLand.abi;
    const bytecode = ZoraLand.bytecode;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const factory = new ethers.ContractFactory(ABI, bytecode, signer);
    console.log(factory);

    const notNull = Object.values(formInput).every((value) => {
      if (value !== null || value !== undefined || value !== "") {
        return true;
      }
      return false;
    });

    console.log(notNull);

    if (notNull) {
      const {name, description, symbol, image, animation_url} = formInput;
        const metadataFile = new File([JSON.stringify({name, description, symbol, image, animation_url})], "tokenURI.json")
        // @ts-ignore
        const cid = await client.put([metadataFile], {
          wrapWithDirectory: false,
        });
        let contract = new ethers.Contract("0x55Df5c5CF92bb20A038e55617AF1cC2a78A78D8d", ZoraLand.abi, signer);
        let transaction = await contract.createToken(`https://ipfs.infura.io/ipfs/${cid}`);

        let tx = await transaction.wait();

        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();
    }
  }

  async function onChangeImg(e) {
    
      try {
        const cid = await client.put(e.target.files, {
          wrapWithDirectory: false,
        });
        updateFormInput({ ...formInput, image: "ipfs://" + cid });
        const url = `https://ipfs.infura.io/ipfs/${cid}`;
        setImgFileUrl(url);
      } catch (e) {
        console.log(e);
      }  
  }

  async function onChangeAnimationURI(e) {
    try {
      const cid = await client.put(e.target.files, {
        wrapWithDirectory: false,
      });
      updateFormInput({ ...formInput, animation_url: "ipfs://" + cid });
      const url = `https://ipfs.infura.io/ipfs/${cid}`;
      setAnimationFileUrl(url);
    } catch (e) {
      console.log(e);
    }
}

  return (
    <div>
      <Header />
      {address ? (
        <div className="lg:w-1/4 w-1/2 lg:ml-60 ml-24 -mt-8 lg:mt-0 flex flex-col pb-12">
          <h1 className="mt-20 font-bold text-3xl text-white">CREATE NEW ZORA LAND TOKEN</h1>
          <h4 className="mt-12 font-bold text-white">IMAGE URI</h4>
          <input
            type="file"
            placeholder="Image URI"
            className="my-4"
            onChange={onChangeImg}
          />
          {!imgFileUrl && <img src="/uploadimg.png" />}
          {imgFileUrl && (
            <img className="rounded mt-4" width="350" src={imgFileUrl} />
          )}
          <h4 className="mt-8 font-bold text-white">NAME</h4>
          <input
            className="mt-2 border-blue-500 rounded p-4 bg-blue-form-field"
            onChange={(e) => {
              updateFormInput({ ...formInput, name: e.target.value });
            }}
          ></input>
          <h4 className="mt-8 font-bold text-white">SYMBOL</h4>
          <input
            className="mt-2 border-blue-500 rounded p-4 bg-blue-form-field"
            onChange={(e) => {
              updateFormInput({ ...formInput, symbol: e.target.value });
            }}
          ></input>
          <h4 className="mt-8 font-bold text-white">ANIMATION URI</h4>
          <h4 className="w-140 mt-2 mb-2 text-gray-600">
            Upload multimedia of your choice
          </h4>
          <input
            type="file"
            placeholder="Animation URI"
            className="my-4"
            onChange={onChangeAnimationURI}
          />
          <h4 className="mt-8 font-bold text-white">DESCRIPTION</h4>
          <h4 className="w-140 mt-2 text-gray-600">
            Include details about the token
          </h4>
          <input
            className="mt-4 border rounded p-4 bg-blue-form-field"
            onChange={(e) => {
              updateFormInput({ ...formInput, description: e.target.value });
            }}
          ></input>

          <button
            className="font-bold mt-12 mb-24 text-white lg:w-48 sm:w-24 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-600 hover:to-orange-600 text-white rounded p-4 shadow-lg"
            onClick={onSubmit}
          >
            CREATE
          </button>
        </div>
      ) : (
        <div className="h-screen">
          <p className="ml-[30%] lg:ml-[40%] mt-20 text-xl lg:text-3xl text-white">
            Please connect your wallet
          </p>
        </div>
      )}
    </div>
  );
}
