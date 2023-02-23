import { useState } from "react"
import retrievePublicStickies from "../logic/retrieve-public-stickies"
import retrieveMyStickies from "../logic/retrieve-my-stickies"
import updateStickyText from "../logic/update-sticky-text"
import deleteSticky from "../logic/delete-sticky"
import updateStickyVisibility from "../logic/update-sticky-text"
import toggleLikeSticky from "../logic/toggle-like-sticky"
import { HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'



function List() {
    const [listUpdateStamp, setListUpdateStamp] = useState(Date.now())

    let stickies

    try {
        stickies = retrievePublicStickies()

        console.log(stickies)
    } catch (error) {
        alert(error.message)
    }

    const handleText = event => {

        try {
            updateStickyText(sessionStorage.userId, event.target.id, event.target.innerText)

        } catch (error) {
            alert(error.message)
        }
    }

    const handleDelete = event => {
        try {

            deleteSticky(sessionStorage.userId, event.target.id)
            setListUpdateStamp(Date.now())

        } catch (error) {
            alert(error.message)
        }
    }
    const handleUpdateVisibility = event => {
        try {
            updateStickyVisibility(sessionStorage.userId, event.target.id, event.target.dataset.visibility === 'public' ? 'private' : 'public')
            setListUpdateStamp(Date.now())
        } catch (error) {
            alert(error.message)
        }
    }

    const handleLike = event => {
        try {
            toggleLikeSticky(sessionStorage.userId, event.target.id)

            setListUpdateStamp(Date.now())
        } catch (error) {
            alert(error.message)
        }
    }


    return <ul className="flex flex-col items-center h-screen gap-4 m-3">
        {stickies.map(sticky => <li className="gap-5 p-5 shadow-lg shadow-black flex flex-col items-center m-10 w-[40ch] bg-white rounded-full" key={sticky.id} >
            <div className="text-right">
                {sticky.user === sessionStorage.userId &&
                    <button className="w-5 h-5 bg-black text-[white] m-1" id={sticky.id} data-visibility={sticky.visibility} onClick={handleUpdateVisibility}>+/-</button>}
                {sticky.user === sessionStorage.userId &&
                    <button className="w-5 h-5 bg-black text-[white] m-1" id={sticky.id} onClick={handleDelete}>X</button>}
            </div>
            <p id={sticky.id} contentEditable={sticky.user === sessionStorage.userId ? true : false} onKeyUp={handleText} suppressContentEditableWarning={true}>{sticky.text}</p>

            <strong>{sticky.user}</strong>
            <div >
                <div className="flex flex-col items-end">
                    <button className="h-5 w-10 bg-black text-[gold] m-1 flex justify-center" id={sticky.id} onClick={handleLike} title={sticky.likes.join('\n')}>{sticky.likes.includes(sessionStorage.userId) ? <HeartIcon className="h-4 w-4 text-red-500" /> : <HeartIconOutline className="h-4 w-4 text-black-500" />} <span className="color-[white]">{sticky.likes.length}</span></button>

                    <strong>{sticky.user}</strong>
                </div>
            </div>
            {sticky.likes.length}
        </li>)}
    </ul>
}

export default List
