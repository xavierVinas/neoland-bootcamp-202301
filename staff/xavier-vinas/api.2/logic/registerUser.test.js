const { verify } = require('../utils/test-it')
const registerUser = require('./registerUser')
const deleteAllFilesFromDirectory = require('../utils/deleteAllFilesFromDirectory')
const checkFileExists = require('../utils/checkFileExists')
const fs = require('fs')

// case 0

function case0(done) {
    deleteAllFilesFromDirectory('data/users', error => {
        if (error) {
            done(error)

            return
        }

        const name = 'Marie Curie'
        const age = 87
        const email = 'marie@curie.com'
        const password = '123123123'

        registerUser(name, age, email, password, (error, userId) => {
            if (error) {
                done(error)

                return
            }

            const fileName = userId + '.json'

            const filePath = 'data/users/' + fileName

            checkFileExists(filePath, (error, exists) => {
                if (error) {
                    done(error)

                    return
                }

                verify(exists)

                done()
            })
        })
    })
}
// unhappy test case: register fails because user already registered
// case 1    
function case1(done) {
    // 1. clean db
    deleteAllFilesFromDirectory('data/users', error => {
        if (error) {
            done(error)

            return
        }
        // 2. create with writeFile a user in data/users
        const name = 'Marie Curie'
        const age = 87
        const email = 'marie@curie.com'
        const password = '123123123'

        const user = { name, age, email, password }

        const userJson = JSON.stringify(user) // { "name": "Marie Curie", "age": 87, "email": "marie@curie.com", "password": "123123123" }

        const { writeFile } = fs

        const userId = "user-" + Date.now()

        const file = userId + '.json'

        const userFilePath = 'data/users/' + file

        // 3. call registerUser logic (you will run this in the previous writeFile callback)
        writeFile(userFilePath, userJson, 'utf8', error => {
            if (error) {
                done(error)
                return
            }

            registerUser(name, age, email, password, (error, userId) => {
                // 4. verify that registerUser sent and error to its callback (run this in registerUser callback)
                verify(error.message === "user already registered")
                verify(!!error)
                verify(!userId)

                done()
            })
        })
    })
}

case0(() => {

    case1(() => {

        console.log('end')
    })
})