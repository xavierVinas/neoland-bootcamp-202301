const { verify } = require("../utils/test-it")
const { access, constants } = require("fs")
const registerUser = require("./registerUser")


// case 0
//$ node logic/registeruser.test.js

const name = "Marie Curie"
const age = 87
const email = "marie@curie.com"
const password = "123123123"

registerUser(name, age, email, password, (error, userId) => {
    if (error) {
        done(error)
        return
    }
    const fileName = userId + ".json"
    const filePath = "data/users/" + fileName

    access(filePath, constants.F_OK, error => {
        verify(error === null)
    })
})