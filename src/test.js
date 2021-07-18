const Blockchain = require('./blockchain')

const cryptoCurrency = new Blockchain();
const bc1 = {
    chain: [
        {
            index: 1,
            timestamp: 1626619900381,
            transactions: [],
            nonce: 100,
            hash: "0",
            previousBlockHash: "0"
        },
        {
            index: 2,
            timestamp: 1626619960635,
            transactions: [
                {
                    amount: 100,
                    sender: "EI29FVJ34G8E",
                    recipient: "AWJ293NRFRN1",
                    transactionId: "c2c94f90e7d711eb89aa7f32fa58847d"
                },
                {
                    amount: 100,
                    sender: "EI29FVJ34G8E",
                    recipient: "AWJ293NRFRN1",
                    transactionId: "c477e9f0e7d711eb89aa7f32fa58847d"
                }
            ],
            nonce: 244512,
            hash: "0000426411ad7da59c39c454e7485a4142160add23270a43264e018af945b5f1",
            previousBlockHash: "0"
        },
        {
            index: 3,
            timestamp: 1626619988132,
            transactions: [
                {
                    amount: 10.5,
                    sender: "00",
                    recipient: "a8f908d0e7d711eb89aa7f32fa58847d",
                    transactionId: "cce92b30e7d711eb89aa7f32fa58847d"
                },
                {
                    amount: 100,
                    sender: "EI29FVJ34G8E",
                    recipient: "AWJ293NRFRN1",
                    transactionId: "d8720cb0e7d711eb89aa7f32fa58847d"
                }
            ],
            nonce: 5220,
            hash: "0000eb09b6c7f02b87bfe6bc8bf18fc46016369082175c2e4d009168abcda59a",
            previousBlockHash: "0000426411ad7da59c39c454e7485a4142160add23270a43264e018af945b5f1"
        },
        {
            index: 4,
            timestamp: 1626620050810,
            transactions: [
                {
                    amount: 10.5,
                    sender: "00",
                    recipient: "a8f908d0e7d711eb89aa7f32fa58847d",
                    transactionId: "dd473b70e7d711eb89aa7f32fa58847d"
                },
                {
                    amount: 100,
                    sender: "EI29FVJ34G8E",
                    recipient: "AWJ293NRFRN1",
                    transactionId: "edd9f040e7d711eb89aa7f32fa58847d"
                },
                {
                    amount: 100,
                    sender: "EI29FVJ34G8E",
                    recipient: "AWJ293NRFRN1",
                    transactionId: "f092f5c0e7d711eb89aa7f32fa58847d"
                }
            ],
            nonce: 3682,
            hash: "00002392032157242c0b488c75e4f434329975e28eecf417e814e6a0797b12bf",
            previousBlockHash: "0000eb09b6c7f02b87bfe6bc8bf18fc46016369082175c2e4d009168abcda59a"
        },
        {
            index: 5,
            timestamp: 1626620056259,
            transactions: [
                {
                    amount: 10.5,
                    sender: "00",
                    recipient: "a8f908d0e7d711eb89aa7f32fa58847d",
                    transactionId: "02a322d0e7d811eb89aa7f32fa58847d"
                }
            ],
            nonce: 155538,
            hash: "00007076db8f1c3541d6284f8aa9a094df5a40c4150ac959ef0c8105205577e4",
            previousBlockHash: "00002392032157242c0b488c75e4f434329975e28eecf417e814e6a0797b12bf"
        },
        {
            index: 6,
            timestamp: 1626620061180,
            transactions: [
                {
                    amount: 10.5,
                    sender: "00",
                    recipient: "a8f908d0e7d711eb89aa7f32fa58847d",
                    transactionId: "05e29660e7d811eb89aa7f32fa58847d"
                }
            ],
            nonce: 49776,
            hash: "00009c39bf0b212a933f805ea15b144149e2de7784aa7e4d35e75a325ed46f2c",
            previousBlockHash: "00007076db8f1c3541d6284f8aa9a094df5a40c4150ac959ef0c8105205577e4"
        }
    ],
        pendingTransactions: [
            {
                amount: 10.5,
                sender: "00",
                recipient: "a8f908d0e7d711eb89aa7f32fa58847d",
                transactionId: "08d178f0e7d811eb89aa7f32fa58847d"
            }
        ],
            currentNodeUrl: "http://localhost:5001",
                networkNodes: []
};

console.log(cryptoCurrency.chainIsValid(bc1.chain));