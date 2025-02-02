const { ObjectId } = require('mongodb')

/**
 * Toggles the likeability of a specific sticky
 * 
 * @param {string} userId The userId
 * @param {string} stickyId The sticky identifier
 */
function toggleLikeSticky(userId, stickyId) {
    const stickies = process.db.collection('stickies')

    return stickies.findOne({ _id: new ObjectId(stickyId) })
        .then(sticky => {
            if (!sticky)
                throw new Error('sticky with id ' + stickyId + ' not found')

            const likes = sticky.likes

            const index = likes.indexOf(userId)

            if (index < 0)
                likes.push(userId)
            else
                likes.splice(index, 1)

            return stickies.updateOne({ _id: new ObjectId(stickyId) }, { $set: { likes } })
        })
}

module.exports = toggleLikeSticky