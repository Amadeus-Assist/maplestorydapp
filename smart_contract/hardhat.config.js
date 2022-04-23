/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.13",
  defaultNetwork: "Huygens_dev",
  networks: {
    Huygens_dev: {
      url:process.env.HUYGENS_DEV_URL,
      accounts: [process.env.HUYGENS_DEV_PRIVATE_KEY]
    }
  }
};