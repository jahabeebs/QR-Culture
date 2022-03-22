async function main() {
    const NFTContract = await hre.ethers.getContractFactory("CrepesAndWaffles");
    const nft = await NFTContract.deploy();
    await nft.deployed();

    console.log("Crepes and Waffles contract deployed to:", nft.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
