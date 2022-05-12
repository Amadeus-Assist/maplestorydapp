import Mcp from "./mcp";

const abi = require("./abi.json");

const McpFunc = new Mcp();

McpFunc.Contract.setProvider("http://18.182.45.18:8765");

const tokenAddress = "0x0298FC08107DC7Ec5Be87F8223dfc4A3D0461aE8";
const coreAddress = "0x0298FC08107DC7Ec5Be87F8223dfc4A3D0461aE8";

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
