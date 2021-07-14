const express = require('express');
const uuid = require('uuid');
const Blockchain = require('./blockchain');
const rp = require('request-promise')

const app = express();
const cryptoCurrency = new Blockchain();
const nodeAddress = uuid.v1()
    .split('-')
    .join('');

const port = process.argv[2];

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

    cryptoCurrency.createNewTransaction(10.5, '00', nodeAddress);

    res.json({
        note: 'New block mined successfully',
        block: newBlock,
    });
});

app.post('/register-and-broadcast-node', async (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;

    if (cryptoCurrency.networkNodes.indexOf(newNodeUrl) === -1) {
        cryptoCurrency.networkNodes.push(newNodeUrl);
    }

    const regNodesPromises = [];
    
    //Register newNode with other nodes
    cryptoCurrency.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl,
            },
            json: true,
        };

        regNodesPromises.push(rp(requestOptions));
    });

    await Promise.all(regNodesPromises);

    const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: {
            allNetworkNodes: [
                ...cryptoCurrency.networkNodes,
                cryptoCurrency.currentNodeUrl
            ],
        },
        json: true,
    }

    await rp(bulkRegisterOptions);
    res.json({ note: 'New Node registered with network successfully' });
});

app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;

    const nodeNotAlreadyPresent = cryptoCurrency.networkNodes.indexOf(newNodeUrl) === -1;
    const notCurrentNode = cryptoCurrency.currentNodeUrl !== newNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
        cryptoCurrency.networkNodes.push(newNodeUrl);
    }

    res.json({ note: 'New node registered successfully' });
});

app.post('/register-nodes-bulk', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = cryptoCurrency.networkNodes.indexOf(networkNodeUrl) === -1;
        const notCurrentNode = cryptoCurrency.currentNodeUrl !== networkNodeUrl;

        if (nodeNotAlreadyPresent && notCurrentNode) {
            cryptoCurrency.networkNodes.push(networkNodeUrl);
        }
    });

    res.json({ note: 'Bulk registration successful' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});