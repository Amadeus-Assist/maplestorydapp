from web3 import Web3
import json

with open("backend\\abi.json",
          "r") as file:
    abi = json.load(file)

w3 = Web3(Web3.HTTPProvider("http://18.182.45.18:8765/"))
operator_address = "0xD296cfEd720f30b48A6EF91EBad782E3042ffbA0"
contract_address = "0x7afE6C2596A434AdB04802d103e6BCfe452864De"
receiver_address = "0x4135E35Bb807f8e7eD4daAD179Cb9c5f17f326bc"

maple_contract = w3.eth.contract(address=contract_address, abi=abi)


# EquipMenu = ['Name:','ATK','DEF','MAG','POW','ToD','state']


def marketMenu():
    flag = 0
    for i in range(1, maple_contract.functions.totalSupply().call() + 1):
        if flag == 0:
            print("Market Item List:")
            marketList = []
        Weapon = maple_contract.functions.getEquipment(i).call()
        # mydict = list(zip(EquipMenu, Weapon))
        marketList = marketList + [Weapon]
        flag = 1
    TotalNum = maple_contract.functions.totalSupply().call()
    print("Total Supply Number:", TotalNum)
    print(marketList)


def selfBalance(receiver_address):
    Account_remain = maple_contract.functions.getDeposit(receiver_address).call()
    print("Account Balance:", Account_remain)


def selfNFT(receiver_address):
    flag = 0
    for i in range(0, len(maple_contract.functions.equipmentOfOwner(receiver_address).call())):
        if flag == 0:
            print("Player's Item List:")
            myItemlist = []
        OwnedList = maple_contract.functions.equipmentOfOwner(receiver_address).call()
        Weapon = maple_contract.functions.getEquipment(OwnedList[i]).call()
        myItemlist = myItemlist + [Weapon]
        flag = 1
    print(myItemlist)
    return myItemlist


def createNFT(receiver, name, attack, defense, magic_defense, power_hit, drop_time, cost):
    nonce = w3.eth.getTransactionCount(receiver)
    tx_data = maple_contract.encodeABI(fn_name="createEquipmentNFT", args=[receiver_address, name, attack, defense,
                                                                           drop_time, cost])
