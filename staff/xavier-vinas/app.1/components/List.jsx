function List() {
    const [listUpdateStamp, setListUpdateStamp] = React.useState(Date.now())

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
            <div  >
                <img className="flex flex-col items-center w-10"
                    src={sticky.likes.includes(sessionStorage.userId) ? "public/heart-full.svg" : "public/heart.svg"}
                    onClick={handleLike} id={sticky.id} title={sticky.likes.join('\n')}
                />

            </div>
            {sticky.likes.length}
        </li>)}
    </ul>
}
