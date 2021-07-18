const sha256 = require('sha256');
const uuid = require('uuid');
const currentNodeUrl = process.argv[3];

function Blockchain () {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    this.createNewBlock(100, '0', '0');
};

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce,
        hash,
        previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock
};

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount, sender, recipient,
        transactionId: uuid.v1().split('-').join(''),
    };

    return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock().index + 1;
};

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;
};

Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    
    while (hash.substring(0,4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
};

let validChain = true;
Blockchain.prototype.chainIsValid = function (blockchain) {
    let validChain = true;

    for (let i=1; i<blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i-1];

        const blockHash = this.hashBlock(
            previousBlock.hash,
            {
               transactions: currentBlock.transactions,
               index: currentBlock.index, 
            },
            currentBlock.nonce
        );

        if (currentBlock.previousBlockHash !== previousBlock.hash) {
            validChain = false;
            break;
        }

        if (blockHash.substring(0, 4) !== '0000') {
            validChain = false;
            break;
        }
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock.nonce === 100;
    const correctPreviousBlockHash = genesisBlock.previousBlockHash === '0';
    const correctHash = genesisBlock.hash === '0';
    const correctTransactions = genesisBlock.transactions.length === 0;

    if (!correctNonce || !correctHash || !correctPreviousBlockHash || !correctTransactions) {
        validChain = false;
    }

    return validChain;
};

Blockchain.prototype.getBlock = function (blockHash) {
    correctBlock = null;
    this.chain.forEach(block => {
        if (block.hash == blockHash) {
            correctBlock = block;
        }
    });

    return correctBlock;
};

module.exports = Blockchain;