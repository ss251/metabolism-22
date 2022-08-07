const apiKey = process.env.NEXT_ALCHEMY_API_KEY;


export const fetchNFTs = async (owner, chainId, contractAddress, setNFTs, retryAttempt) => {
    let endpoint;
    if (chainId === 1) {
        endpoint = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
    } else if (chainId === 4) {
        endpoint = `https://eth-rinkeby.alchemyapi.io/v2/${apiKey}`
    }
    else if (chainId === 80001) {
        endpoint = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;
    }
    if (retryAttempt === 5) {
        return;
    }
    if (owner) {
        let data;
        try {
            if (contractAddress) {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`).then(data => data.json())
            } else {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}`).then(data => data.json())
            }
        } catch (e) {
            fetchNFTs(owner, chainId, contractAddress, setNFTs, retryAttempt + 1)
        }

        setNFTs(data.ownedNfts)
        return data
    }
}