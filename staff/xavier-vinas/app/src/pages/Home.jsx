import { useState, useEffect } from "react"
import createSticky from "../logic/create-sticky"
import List from "../components/List"
import Profile from "../components/Profile"
import MyList from "../components/MyList"
import retrieveUser from "../logic/retrieve-user"
import Button from "../library/Button"


function Home({ onLogout, onUnregisterUser }) {


    const [view, setView] = useState('list')
    const [listUpdateStamp, setListUpdateStamp] = useState(Date.now())
    const [user, setUser] = useState({})

    const handleShowProfile = event => {
        event.preventDefault()

        setView('profile')
    }

    const handleShowList = event => {
        event.preventDefault()

        setView('list')
    }
    const handleAdd = () => {
        try {
            createSticky(sessionStorage.userId, '', 'public', error => {
                if (error) {
                    alert(error.message)

                    return
                }

                setListUpdateStamp(Date.now())
            })
        } catch (error) {
            alert(error.message)
        }
    }


    const handleLogout = () => {
        delete sessionStorage.userId
        onLogout()
    }

    const handleShowMyList = event => {
        event.preventDefault()

        setView('my-list')
    }

    useEffect(() => {
        try {
            retrieveUser(sessionStorage.userId, (error, user) => {
                if (error) {
                    alert(error.message)

                    return
                }

                setUser(user)
            })
        } catch (error) {
            alert(error.message)
        }
    }, [])

    const handleToggleFav = (userId, stickyId) => {
        setUser(user => {
            const newUser = { ...user }
            const favs = [...user.favs]
            newUser.favs = favs

            const indexOfSticky = favs.indexOf(stickyId)

            if (indexOfSticky < 0)
                favs.push(stickyId)
            else
                favs.splice(indexOfSticky, 1)

            return newUser
        })
    }


    return <div className="max-h-md" >
        <header className="" >

            <nav className="flex justify-between items-center " >
                <a onClick={handleShowList} className="logo-link" href=""><img className="logo" src="https://cdn-icons-png.flaticon.com/128/431/431249.png" alt=""></img></a>
                <a onClick={handleShowMyList} className="text-2xl font-black  underline" href="">My Stickies</a>
                <a onClick={handleShowProfile} className="text-2xl font-black  underline" href="">{user.name}</a>
                <Button onClick={handleLogout}>Logout</Button>

            </nav>

        </header>

        <main className="flex flex-col items-center">

            {view === "list" && <List listUpdateStamp={listUpdateStamp} user={user} onToggleFav={handleToggleFav} />}

            {view === "profile" && <Profile onUnregisterUser={onUnregisterUser} />}

            {view === "my-list" && <MyList listUpdateStamp={listUpdateStamp} user={user} onToggleFav={handleToggleFav} />}
        </main>

        <footer className=" border-double border-4 fixed bottom-0 left-0 flex justify-center bg-[#d1d5db] w-full  ">

            {view !== 'profile' && <Button onClick={handleAdd}>+</Button>}
        </footer>

    </div>

}
export default Home
