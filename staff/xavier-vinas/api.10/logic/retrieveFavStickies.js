// TODOconst { Types: { ObjectId } } = require('mongoose')
const { validateUserId } = require('com')
const { User, Sticky } = require('../data/models')

/**
 * Retrieves the favorites stickies from user
 * 
 * @param {string} userId The user id
 */
function retrieveFavStickies(userId) {
    validateUserId(userId)

    return User.findById(userId).populate({ path: 'favs', select: '-__v', populate: { path: 'user', select: 'name' } }).lean()
        .then(user => {
            if (!user) throw new Error(`user with id ${userId} not found`)

            const stickies = user.favs

            stickies.forEach(sticky => {
                // sanitize

                if (sticky._id) {
                    sticky.id = sticky._id.toString()
                    delete sticky._id
                }

                if (sticky.user._id) {
                    sticky.user.id = sticky.user._id.toString()
                    delete sticky.user._id
                }

                sticky.likes = sticky.likes.map(like => like.toString())
            })

            return stickies
        })
}

module.exports = retrieveFavStickies