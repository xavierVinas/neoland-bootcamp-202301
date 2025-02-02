const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { connect, disconnect } = require('mongoose')
const { sign } = require('jsonwebtoken')
const JWT_SECRET = 'atrikitawn tawn tawn 123'

const registerUser = require('./logic/registerUser')
const authenticateUser = require('./logic/authenticateUser')
const retrieveUser = require('./logic/retrieveUser')
const unregisterUser = require('./logic/unregisterUser')
const updateUserPassword = require('./logic/updateUserPassword')
const updateUserEmail = require('./logic/updateUserEmail')

const { FormatError, ExistenceError, AuthError, CoherenceError, ValueError } = require('com')

const createSticky = require('./logic/createSticky')
const retrievePublicStickies = require('./logic/retrievePublicStickies')
const retrieveMyStickies = require('./logic/retrieveMyStickies')
const updateStickyText = require('./logic/updateStickyText')
const updateStickyVisibility = require('./logic/updateStickyVisibility')
const toggleLikeSticky = require('./logic/toggleLikeSticky')
const deleteSticky = require('./logic/deleteSticky')
const changeStickyColor = require('./logic/changeStickyColor')
const toggleFavSticky = require('./logic/toggleFavSticky')
const retrieveFavStickies = require('./logic/retrieveFavStickies')
const verifyToken = require('./utils/verifyToken')
const retrieveUserProfile = require('./logic/retrieveUserProfile')



connect('mongodb://127.0.0.1:27017/mydb')
    .then(() => {
        const server = express()
        const jsonBodyParser = bodyParser.json()

        server.use(cors())

        server.post('/users', jsonBodyParser, (req, res) => {
            try {
                const user = req.body

                const { name, age, email, password } = user

                registerUser(name, age, email, password)
                    .then(() => res.status(201).send())
                    // asincrono
                    .catch(error => {
                        if (error instanceof CoherenceError)
                            res.status(409)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })

            } catch (error) {
                // sincrono
                if (error instanceof TypeError || error instanceof RangeError || error instanceof FormatError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })

        server.post('/users/auth', jsonBodyParser, (req, res) => {
            try {
                const credentials = req.body

                const { email, password } = credentials

                authenticateUser(email, password)
                    .then(userId => sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' }))
                    .then(token => res.status(200).json({ token }))
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else if (error instanceof AuthError)
                            res.status(401)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError || error instanceof RangeError || error instanceof FormatError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })

        server.get('/users', (req, res) => {
            try {
                const userId = verifyToken(req)

                retrieveUser(userId)
                    .then(user => res.json(user))
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })

            }
        })

        server.delete('/users', jsonBodyParser, (req, res) => {
            try {
                const userId = verifyToken(req)

                const { password } = req.body

                unregisterUser(userId, password)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else if
                            (error instanceof AuthError)
                            res.status(409)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError || error instanceof RangeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })

            }
        })

        server.patch('/users/password', jsonBodyParser, (req, res) => { //patch es actualizar
            try {
                const userId = verifyToken(req)

                const { password, newPassword, newPasswordConfirm } = req.body

                updateUserPassword(userId, password, newPassword, newPasswordConfirm)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else if (error instanceof AuthError)
                            res.status(401)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof CoherenceError || error instanceof TypeError || error instanceof RangeError)
                    res.status(400)
                else
                    res.status(500)
                res.json({ error: error.message })
            }
        })


        server.patch('/users/email', jsonBodyParser, (req, res) => {
            try {
                const userId = verifyToken(req)

                const { newEmail, password } = req.body

                updateUserEmail(userId, newEmail, password)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else if (error instanceof AuthError)
                            res.status(401)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError || error instanceof RangeError || error instanceof FormatError)
                    res.status(400)
                else
                    res.status(500)
                res.json({ error: error.message })
            }
        })




        server.post('/stickies', jsonBodyParser, (req, res) => {
            try {
                const userId = verifyToken(req)

                const { text, visibility } = req.body

                createSticky(userId, text, visibility)
                    .then(() => res.status(201).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError || error instanceof ValueError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })

        server.get('/stickies', (req, res) => {
            try {
                const userId = verifyToken(req)

                retrievePublicStickies(userId)
                    .then(stickies => res.status(200).json(stickies))
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })
        server.get('/stickies/user', (req, res) => {
            try {
                const userId = verifyToken(req)

                retrieveMyStickies(userId)
                    .then(stickies => res.status(200).json(stickies))
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })


        server.patch('/stickies/:stickyId/text', jsonBodyParser, (req, res) => {
            try {
                const userId = verifyToken(req)

                const { stickyId } = req.params
                const { text } = req.body

                updateStickyText(userId, stickyId, text)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else if (error instanceof CoherenceError)
                            res.status(401)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })

        server.patch('/stickies/:stickyId/visibility', jsonBodyParser, (req, res) => {
            try {
                const userId = verifyToken(req)
                const { stickyId } = req.params
                const { visibility } = req.body

                updateStickyVisibility(userId, stickyId, visibility)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else if (error instanceof CoherenceError)
                            res.status(401)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError || error instanceof ValueError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })

        server.patch('/stickies/:stickyId/likes', jsonBodyParser, (req, res) => {
            try {
                const userId = verifyToken(req)
                const { stickyId } = req.params

                toggleLikeSticky(userId, stickyId)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })

        server.delete('/stickies/:stickyId', (req, res) => {
            try {
                const userId = verifyToken(req)

                const { stickyId } = req.params

                deleteSticky(userId, stickyId)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else if (error instanceof CoherenceError)
                            res.status(409)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })
        server.patch('/stickies/:stickyId/color', jsonBodyParser, (req, res) => {
            try {
                const userId = verifyToken(req)

                const { stickyId } = req.params
                const { color } = req.body

                changeStickyColor(userId, stickyId, color)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError || error instanceof ExistenceError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })
        server.patch('/stickies/:stickyId/favs', (req, res) => {
            try {
                const userId = verifyToken(req)

                const { stickyId } = req.params

                toggleFavSticky(userId, stickyId)
                    .then(() => res.status(204).send())
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })
        server.get('/stickies/favs', (req, res) => {
            try {
                const userId = verifyToken(req)

                retrieveFavStickies(userId)
                    .then(stickies => res.status(200).json(stickies))
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })
        server.get('/users/:userProfileId', (req, res) => {
            try {
                const userId = verifyToken(req)
                const { userProfileId } = req.params

                retrieveUserProfile(userId, userProfileId)
                    .then(userProfile => res.status(200).json(userProfile))
                    .catch(error => {
                        if (error instanceof ExistenceError)
                            res.status(404)
                        else
                            res.status(500)

                        res.json({ error: error.message })
                    })
            } catch (error) {
                if (error instanceof TypeError)
                    res.status(400)
                else
                    res.status(500)

                res.json({ error: error.message })
            }
        })


        server.listen(8080, () => console.log('server running on port ' + 8080))
    })