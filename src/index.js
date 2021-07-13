const express = require('express');
const uuid = require('uuid');
const Blockchain = require('./blockchain');

const app = express();
const cryptoCurrency = new Blockchain();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/blockchain', (req, res) => {
    res.send(cryptoCurrency);
});

app.post('/transaction', (req, res) => {
    const blockIndex = cryptoCurrency
        .createNewTransaction(
            req.body.amount,
            req.body.sender,
            req.body.recipient
        );

    res.json({
        note: `Transaction will be added in block ${blockIndex}`
    });
});

app.get('/mine', (req, res) => {
    const lastBlock = cryptoCurrency.getLastBlock();
    const previousBlockHash = lastBlock.hash;

    const currentBlockData = {
        transactions: cryptoCurrency.pendingTransactions,
        index: lastBlock.index + 1,
    };
    const nonce = cryptoCurrency
        .proofOfWork(
            previousBlockHash,
            currentBlockData
        );

    const currentBlockHash = cryptoCurrency
        .hashBlock(
            previousBlockHash,
            currentBlockData,
            nonce
        );

    const newBlock = cryptoCurrency
        .createNewBlock(
            nonce,
            previousBlockHash,
            currentBlockHash
        );

    const nodeAddress = uuid.v1()
        .split('-')
        .join('');
    cryptoCurrency.createNewTransaction(10.5, '00', nodeAddress);

    res.json({
        note: 'New block mined successfully',
        block: newBlock,
    });
});

app.listen(5000, () => {
    console.log('Listening on port 5000');
});