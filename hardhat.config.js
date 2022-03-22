require('dotenv').config()
require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      from: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    },
    mumbai: {
      url: process.env.NODE_URL,
    }
  },
  solidity: "0.8.4",
};
