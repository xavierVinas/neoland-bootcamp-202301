const { validateName, validateAge, validateEmail, validatePassword, validateCallback, ClientError, ServerError, CoherenceError } = require('com')

/**
 * Registers a user in the database
 * 
 * @param {string} name The user full name
 * @param {number} age The user age
 * @param {string} email The user email
 * @param {string} password The user password
 * @param {function} callback The callback
 */
function registerUser(name, age, email, password, cardName, number, cvv, expiration, callback) {
    validateName(name)
    validateAge(age)
    validateEmail(email)
    validatePassword(password)
    validateCallback(callback)
    if (typeof cardName !== 'string') throw new TypeError('cardName is not a string')
    if (typeof number !== 'number') throw new TypeError('number is not a number')
    if (typeof cvv !== 'string') throw new TypeError('cvv is not a string')
    if (typeof expiration !== 'string') throw new TypeError('expiration is not a string')

    const xhr = new XMLHttpRequest

    xhr.onload = () => {
        const { status, response } = xhr

        if (status === 201) {
            callback(null)
        } else {
            const body = JSON.parse(response)

            const { error } = body

            if (status === 400)
                callback(new ClientError(error))
            else if (status === 409)
                callback(new CoherenceError(error))
            else if (status === 500)
                callback(new ServerError(error))
        }
    }

    xhr.onerror = () => callback(new Error('network error'))

    xhr.open('POST', 'http://localhost:8080/users')
    xhr.setRequestHeader('Content-Type', 'application/json')

    const user = { name, age, email, password, cardName, number, cvv, expiration }
    const json = JSON.stringify(user)
    xhr.send(json)
}

export default registerUser