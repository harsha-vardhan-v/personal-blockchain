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
    const newTransaction = req.body;

    const blockIndex = cryptoCurrency
        .addTransactionToPendingTransactions(newTransaction);

    res.json({
        note: `Transaction will be added in block ${blockIndex}`,
    })
});

app.post('/transaction/broadcast', async (req, res) => {
    const newTransaction = cryptoCurrency
        .createNewTransaction(
            req.body.amount,
            req.body.sender,
            req.body.recipient,
        );

    const requestPromises = [];
    
    cryptoCurrency.addTransactionToPendingTransactions(newTransaction);
    cryptoCurrency.networkNodes.forEach(async (networkNodeUrl) => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true,
        };

        requestPromises.push(rp(requestOptions))
    });

    await Promise.all(requestPromises)
    res.json({
        note: 'Transaction created and broadcast successfully'
    });
});

app.get('/mine', async (req, res) => {
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

    const requestPromises = [];

    cryptoCurrency.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock },
            json: true,
        };

        requestPromises.push(rp(requestOptions));
    });

    await Promise.all(requestPromises);
    
    const requestOptions = {
        uri: cryptoCurrency.currentNodeUrl + '/transaction/broadcast',
        method: 'POST',
        body: {
            amount: 10.5,
            sender: '00',
            recipient: nodeAddress,
        },
        json: true,
    }

    await rp(requestOptions);
    
    res.json({
        note: 'New block mined successfully',
        block: newBlock,
    });
});

app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = cryptoCurrency.getLastBlock();

    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock.index + 1 === newBlock.index;

    if (correctHash && correctIndex) {
        cryptoCurrency.chain.push(newBlock);
        cryptoCurrency.pendingTransactions = [];

        res.json({
            note: 'New block received and accepted',
            newBlock
        });
    } else {
        res.json({
            note: 'New block rejected',
            newBlock
        });
    }
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
            body: { newNodeUrl },
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