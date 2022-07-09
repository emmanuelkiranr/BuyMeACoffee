module.exports = {
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "Buy",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_message",
          type: "string",
        },
      ],
      name: "buyChai",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getMemos",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "message",
              type: "string",
            },
          ],
          internalType: "struct BuyMeAChai.Memo[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "updateOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_newAccount",
          type: "address",
        },
      ],
      name: "withdrawNewAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
