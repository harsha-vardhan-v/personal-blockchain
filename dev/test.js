const Blockchain = require('./blockchain')

const cryptoCurrency = new Blockchain();

cryptoCurrency.createNewBlock();

console.log(cryptoCurrency);