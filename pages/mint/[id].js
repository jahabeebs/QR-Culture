import React from 'react';
import {ethers} from 'ethers';
import {useState} from 'react';
import Web3Modal from 'web3modal'
import CrepesAndWaffles from '/artifacts/contracts/CrepesAndWaffles.sol/CrepesAndWaffles.json'
import {nftContractAddress} from '/config';
import Image from 'next/image';

export default function MintPage() {
    const [address, setAddress] = useState()
    const [nftsOwned, setNftsOwned] = useState(0);
    const [showMe, setShowMe] = useState(false);
    let crepesAndWafflesContract;
    let finalSigner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    let tokensOwned;

    async function mintNFT() {
        const providerOptions = {}
        const web3Modal = new Web3Modal({disableInjectedProvider: false, cacheProvider: false, providerOptions});
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = await provider.getSigner();
        setAddress(await signer.getAddress());
        console.log("current address is " + address + " chainID is " + await signer.getChainId());
        crepesAndWafflesContract = new ethers.Contract(nftContractAddress, CrepesAndWaffles.abi, signer);
        console.log(nftContractAddress + " is nftContractAddress");
        console.log(crepesAndWafflesContract + " is crepesAndWafflesContract");
        const tokenURI = "https://gateway.ipfs.io/ipfs/QmQbE7vMQqSG1aWyvexQZSUk5ciqk5mbJWe6HpgK6FZX4w";
        const transaction = await crepesAndWafflesContract.sendToCustomer("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", tokenURI)
        transaction.wait();
        console.log(transaction + "is transaction");
        await loadNFT(provider);
    }

    async function loadNFT() {
        console.log("final signer is " + finalSigner);
        const tokensOfFirstWallet = await listTokensOfOwner(nftContractAddress, finalSigner);
        console.log("number of tokens you have is " + tokensOfFirstWallet.size);
        console.log("tokensOfFirstWallet are " + tokensOfFirstWallet);
        console.log(listTokensOfOwner(nftContractAddress, finalSigner));
        console.log(listTokensOfOwner(nftContractAddress, "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"));
        tokensOwned = tokensOfFirstWallet.size;
        setNftsOwned(tokensOwned += 1);
        console.log("tokensOwned includes " + tokensOwned);
    }

    function loadGallery() {
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
        <div className="flex flex-col items-center">
            <div>
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
            <div style={{
                display: showMe ? "block" : "none"
            }}>
                {nftsOwned}
            </div>
            <div className="mt-4">

                <Image src={"https://gateway.ipfs.io/ipfs/QmQbE7vMQqSG1aWyvexQZSUk5ciqk5mbJWe6HpgK6FZX4w"} width="250px"
                       height="250px"/>
            </div>
        </div>
    );
}