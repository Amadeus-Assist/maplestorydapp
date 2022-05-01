import Mcp from "./mcp";

const abi = require("./abi.json");

const McpFunc = new Mcp();

McpFunc.Contract.setProvider("http://18.182.45.18:8765");

const tokenAddress = "0x7afE6C2596A434AdB04802d103e6BCfe452864De";
const coreAddress = "0x7afE6C2596A434AdB04802d103e6BCfe452864De";

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