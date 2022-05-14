import Mcp from "./mcp";

const abi = require("./abi.json");

const McpFunc = new Mcp();

McpFunc.Contract.setProvider("http://18.182.45.18:8765");

const tokenAddress = "0x22C593597fDF424b966D6684Ca96864624AC343C";
const coreAddress = "0x22C593597fDF424b966D6684Ca96864624AC343C";

const Instance = new McpFunc.Contract(
    abi,
    tokenAddress
);

const Contract = {
    tokenAddress,
    Instance,
    coreAddress
};

export default Contract;
