import React from 'react';
import {ethers} from 'ethers';
import {useState} from 'react';
import Web3Modal from 'web3modal'
import CrepesAndWaffles from '/artifacts/contracts/CrepesAndWaffles.sol/CrepesAndWaffles.json'
import {HARDHAT_PRIVATE_KEY, nftContractAddress} from '/config';
import Image from 'next/image';
import {useRouter} from "next/router";

export default function MintPage() {
    const router = useRouter();
    const [address, setAddress] = useState()
    const [nftsOwned, setNftsOwned] = useState("-");
    const [showMe, setShowMe] = useState(false);
    let crepesAndWafflesContract;
    let finalSigner = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
    let tokensOwned;
    const dynamicUrl = router.query.id;

    async function mintNFT() {
        const key = ethers.utils.formatBytes32String(dynamicUrl.toString());
        const providerOptions = {}
        const web3Modal = new Web3Modal({disableInjectedProvider: false, cacheProvider: false, providerOptions});
        const instance = await web3Modal.connect();
        const customerProvider = new ethers.providers.Web3Provider(instance);
        const customerSigner = await customerProvider.getSigner();
        setAddress(await customerSigner.getAddress());
        console.log("current address is " + address + " chainID is " + await customerSigner.getChainId());
        console.log(nftContractAddress + " is nftContractAddress");
        const tokenURI = "https://gateway.ipfs.io/ipfs/QmQbE7vMQqSG1aWyvexQZSUk5ciqk5mbJWe6HpgK6FZX4w";
        const wallet = new ethers.Wallet(HARDHAT_PRIVATE_KEY);
        const provider = new ethers.providers.JsonRpcProvider();
        const signerToDeploy = await provider.getSigner(wallet.address);
        crepesAndWafflesContract = new ethers.Contract(nftContractAddress, CrepesAndWaffles.abi, signerToDeploy);
        try {
            const transaction = await crepesAndWafflesContract.sendToCustomer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", tokenURI, key);
            transaction.wait();
        } catch (error) {
            console.log(error);
        }
        await loadNFT();
    }

    async function loadNFT() {
        console.log("customer signer is " + finalSigner);
        const tokensOfCustomerWallet = await listTokensOfOwner(nftContractAddress, finalSigner);
        console.log("number of tokens you have is " + tokensOfCustomerWallet.size);
        console.log("tokensOfCustomerWallet are " + tokensOfCustomerWallet);
        console.log(listTokensOfOwner(nftContractAddress, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
        console.log(listTokensOfOwner(nftContractAddress, finalSigner));
        tokensOwned = tokensOfCustomerWallet.size;
        setNftsOwned(tokensOwned);
        console.log("tokensOwned includes " + tokensOwned);
    }

    async function loadGallery() {
        setShowMe(!showMe);
    }

    async function listTokensOfOwner(tokenAddress, account) {
        const token = crepesAndWafflesContract;

        const sentLogs = await token.queryFilter(
            token.filters.Transfer(account, null),
        );
        const receivedLogs = await token.queryFilter(
            token.filters.Transfer(null, account),
        );

        const logs = sentLogs.concat(receivedLogs)
            .sort(
                (a, b) =>
                    a.blockNumber - b.blockNumber ||
                    a.transactionIndex - b.transactionIndex,
            );

        const owned = new Set();

        for (const {args: {from, to, tokenId}} of logs) {
            if (addressEqual(to, account)) {
                owned.add(tokenId.toString());
            } else if (addressEqual(from, account)) {
                owned.delete(tokenId.toString());
            }
        }

        return owned;
    };

    function addressEqual(a, b) {
        return a.toLowerCase() === b.toLowerCase();
    }

    return (
        <body className="w-full h-full bg-gradient-to-r from-cyan-200 to-blue-200">
        <div className="flex flex-col items-center">
            <div className="flex text-2xl font-bold">
                Click to mint your NFT
            </div>
            <div
                className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 mt-4 rounded-full"
                onClick={() => mintNFT()}>

                Mint NFT

            </div>
            <div className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 mt-4 rounded-full"
                 onClick={() => loadGallery()}>
                How many NFTs do I own?
            </div>
            <div className="text-2xl mt-2 font-black" style={{
                display: showMe ? "block" : "none"
            }}>
                You own {nftsOwned}
            </div>
            <div className="mt-4">

                <Image src={"https://gateway.ipfs.io/ipfs/QmQbE7vMQqSG1aWyvexQZSUk5ciqk5mbJWe6HpgK6FZX4w"} width="250px"
                       height="250px"/>
            </div>
        </div>
        </body>
    );
}