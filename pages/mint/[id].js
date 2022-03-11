import React from 'react';
import { ethers } from 'ethers';
import {useEffect, useState } from 'react';
import axios from "axios";
import Web3Modal from 'web3modal'
import CrepesAndWaffles from '/artifacts/contracts/CrepesAndWaffles.sol/CrepesAndWaffles.json'
import {nftContractAddress} from '/config';

export default function MintPage() {
    const [nft, setNFT] = useState([])
    const [loading, setLoading] = useState('not-loaded')

    useEffect(() => {
        loadNFT()
    })

    // async function mintNFT(nft) {
    //     const web3Modal = new Web3Modal();
    //     const connection = await web3Modal.connect();
    //     const provider = new ethers.providers.Web3Provider(connection);
    //     const crepesAndWafflesContract = new ethers.Contract(nftContractAddress, CrepesAndWaffles.abi, provider);
    //     const signer = provider.getSigner();
    //     const transaction = await contract.sendToCustomer()
    // }

    async function loadNFT() {
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        console.log(provider);
        return provider;
        const crepesAndWafflesContract = new ethers.Contract(nftContractAddress, CrepesAndWaffles.abi, provider);
        // const nftReturned = await crepesAndWafflesContract.tokenURI(0);
        // setNFT(nftReturned);
        // setLoading('loaded');
        // if (loading === 'loaded' && nft.length < 1) {
        //     console.log('no NFTs found');
        // }
        // return nftReturned;
    }

    return (
        <div className="flex flex-col items-center">
                <div>
                    Click to mint your NFT
                </div>
            <div
                className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 mt-4 rounded-full">

                Mint NFT

            </div>
        </div>
    );
}