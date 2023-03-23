const { connect, disconnect } = require('mongoose')
const retrieveAuction = require('./retrieveAuction')

connect('mongodb://127.0.0.1:27017/subastadb')
    .then(() => {
        return retrieveAuction("6412dd0f266b2f321035f498", "6412dd0f266b2f321035f49a")
    })
    .then(result => console.log(result))
    .catch(error => console.error(error))
    .finally(() => disconnect())