const Blockchain = require('./blockchain')

const cryptoCurrency = new Blockchain();

cryptoCurrency.createNewBlock(78947, 'SSFJ394DI3', 'R843JFKF4T');
cryptoCurrency.createNewTransaction(100, 'FI4JF3KFO93K', 'TTU48FK404FT')

console.log(cryptoCurrency);