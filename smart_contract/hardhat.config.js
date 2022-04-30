/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.13",
  defaultNetwork: "Huygens_dev",
  networks: {
    Huygens_dev: {
      url:process.env.HUYGENS_DEV_URL,
      accounts: [`0x${process.env.HUYGENS_DEV_PRIVATE_KEY}`]
    }
  }
};
