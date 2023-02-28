import { useState } from "react"
import registerUser from "../logic/register-user"

function Register(props) {
    const [feedback, setFeedback] = useState("")

    const handleSubmit = event => {
        event.preventDefault()

        const name = event.target.name.value
        const age = event.target.age.value
        const email = event.target.email.value
        const password = event.target.password.value

        try {
            registerUser(name, age, email, password, error => {
                if (error) {
                    setFeedback(error.message)

                    return
                }
                props.onNavigateToLogin()
            })

        } catch (error) {
            setFeedback(error.message)
        }
    }

    const handleNavigateToLogin = event => {
        event.preventDefault()

        props.onNavigateToLogin()
    }

    return <div className="flex flex-col items-center justify-center">
        <main>
            <form className=" border-double border-4 flex flex-col items-center gap-4 bg-[#d1d5db] mt-10  p-10 rounded-full" onSubmit={handleSubmit}>

                <div className="flex flex-col justify-center gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/128/9428/9428909.png"></img>

                    <label htmlFor="name">Your username</label>
                    <input className="shadow-lg shadow-black p-1 rounded-full " type="text" placeholder="Enter username" id="name" />

                    <label htmlFor="age">age</label>
                    <input className="shadow-lg shadow-black p-1 rounded-full " type="number" placeholder="Enter age" id="age" />

                    <label htmlFor="email">Email adress</label>
                    <input className="shadow-lg shadow-black p-1 rounded-full " type="email" placeholder="email" id="email" />

                    <label htmlFor="password">choose a pasword<sup>*</sup></label>

                    <input className="shadow-lg shadow-black p-1 rounded-full " type="password" placeholder="pasword" id="password" />
                </div>



                <div>
                    <button className="inline-block rounded border-2 border-danger px-6 pt-2 pb-[6px] text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10" type="submit">Sing me up!</button>
                </div>
            </form>

            <p className="feedback">{feedback} </p>
            <p className="flex items-center justify-center gap-2">to <a href="" onClick={handleNavigateToLogin}>Login</a></p>
        </main>
    </div>
}

export default Register
