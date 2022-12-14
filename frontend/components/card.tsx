import { LazyLoadImage } from 'react-lazy-load-image-component';
import Image from 'next/image';
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

const Card = ({ image, id, title, address, description }) => {
    const { chain } = useNetwork();

    let explorerAddress;
    if (chain?.id === 1) {
        explorerAddress = 'https://etherscan.io/token/';
    } else if(chain?.id === 4) {
        explorerAddress = 'https://rinkeby.etherscan.io/token/';
    } else if(chain?.id === 80001) {
        explorerAddress = 'https://mumbai.polygonscan.com/token/';
    }

    const [errorImage, setErrorImage] = useState(null);
    const errorImageUrl = "/zora.png";

    const url = errorImage ? errorImageUrl : image;
    return (
        <div className="w-80 h-100 ml-8 mr-8 mt-8 h-sm mr-3 mb-4 bg-slate-100 rounded-md" >
            <img className='w-full rounded-t-md' key={id} src={url} width={'full'} height={'full'} onError={(e) => {
                if (!errorImage) {
                    setErrorImage(true);
                }
            }} ></img>
            <div className="p-3">
                <div className="flex mb-3">
                    <div className="flex-grow">
                        <h3 className="text-xl">{title}</h3>
                        <p>{`${id}`}</p>
                    </div>
                    <div className="flex mr-3">
                        <a target="_blank" rel="noreferrer" className="text-blue-700" href={`${explorerAddress}${address}`}>{`${address.slice(0, 4)}...${address.slice(address.length - 4)}`}</a>
                    </div>
                </div>
                <p>{description ? description.slice(0, 200) : "No Description"}</p>
            </div>
            <div className="flex flex-wrap justify-center items-center p-3 ">

            </div>
        </div>
    )
}

export default Card