// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract BuyMeAChai {
    event Buy(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    // To make a function or variable able to receive amount make it payable
    /* 
    Making an address ownable, the compiler at compile time allow that address to access primitives useful
    to manage ethers(like call(), transfer(), send()) and generates the bytecode required to implement them
    or else it would give error if it encounters such primitives in the code
    */
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
        /* 
        By default msg.sender is address payable, but msg.sender stored inside anothe address variable can't 
        access Ether management functions. 
        Here we are storing the value of normal address to owner which is of type address payable (ie different 
        data type), so convert msg.sender to payable type 
        */
    }

    function buyChai(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "Cannot buy coffee with 0 ETH");
        memos.push(
            Memo({
                from: msg.sender,
                timestamp: block.timestamp,
                name: _name,
                message: _message
            })
        );
        emit Buy(msg.sender, block.timestamp, _name, _message);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not a owner");
        _;
    }

    function updateOwner(address payable _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function withdraw() public onlyOwner {
        require(owner.send(address(this).balance));
        /* 
        address(this) is the contract address where the amount is stored and address(this).balance is accessing 
        the balance variable/field this contract which shows how much money is stored.
        */
    }

    function withdrawNewAccount(address payable _newAccount) public onlyOwner {
        require(_newAccount.send(address(this).balance));
    }
}
