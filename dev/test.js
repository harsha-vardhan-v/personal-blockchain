const Blockchain = require('./blockchain')

const cryptoCurrency = new Blockchain();

const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11';
const currentBlockData = [
    {
        amount: 10,
        sender: 'B4CEE9C05CD571',
        recipient: '3A3F6E42D48E9',
    },
    {
        amount: 10,
        sender: 'B4CEE9C05CD571',
        recipient: '3A3F6E42D48E9',
    },
    {
        amount: 10,
        sender: 'B4CEE9C05CD571',
        recipient: '3A3F6E42D48E9',
    },
];
const nonce = 100;
const hash = cryptoCurrency.hashBlock(previousBlockHash, currentBlockData, nonce);

console.log(hash);