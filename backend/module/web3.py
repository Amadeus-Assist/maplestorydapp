from web3 import Web3
import json

with open("abi.json", "r") as file:
    abi = json.load(file)

w3 = Web3(Web3.HTTPProvider("http://18.182.45.18:8765/"))
operator_address = "0xD296cfEd720f30b48A6EF91EBad782E3042ffbA0"
contract_address = "0x7afE6C2596A434AdB04802d103e6BCfe452864De"
receiver_address = "0x4135E35Bb807f8e7eD4daAD179Cb9c5f17f326bc"

maple_contract = w3.eth.contract(address=contract_address, abi=abi)

EquipMenu = ['Name:','ATK','DEF','MAG','POW','ToD','state']
#print(maple_contract.functions.getEquipment(1).call())
flag = 0
for i in range(1,maple_contract.functions.totalSupply().call()+1):
    if flag == 0:
        print("Market Item List:")
    Weapon = maple_contract.functions.getEquipment(i).call()
    mydict = dict(zip(EquipMenu, Weapon))
    print(mydict)

#print(maple_contract.functions.createEquipmentNFT(operator_address,'阿姆斯特朗回旋炮',114,514,1919,810,142412,0).call())

Account_remain = maple_contract.functions.getDeposit(receiver_address).call()
print("Account Balance:", Account_remain)

TotalNum = maple_contract.functions.totalSupply().call()
print("Total Supply Number:", TotalNum)


#print(maple_contract.functions.equipmentOfOwner(receiver_address).call())
flag = 0
for i in range(0,len(maple_contract.functions.equipmentOfOwner(receiver_address).call())):
    if flag == 0:
        print("Player's Item List:")
    OwnedList = maple_contract.functions.equipmentOfOwner(receiver_address).call()
    Weapon = maple_contract.functions.getEquipment(OwnedList[i]).call()
    mydict = dict(zip(EquipMenu, Weapon))
    flag = 1
    print(mydict)