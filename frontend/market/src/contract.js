import Mcp from "./mcp";

const abi = require("./abi.json");

const McpFunc = new Mcp();

McpFunc.Contract.setProvider("http://18.182.45.18:8765");

const tokenAddress = "0xcd55c2b7E1A4273876353DB9f780a56b6d139374";
const coreAddress = "0xcd55c2b7E1A4273876353DB9f780a56b6d139374";

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
