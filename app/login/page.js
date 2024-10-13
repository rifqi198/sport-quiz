"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    useEffect(() => {
        const loggedInUser = localStorage.getItem("login")
        if (loggedInUser) {
            router.push('/quiz')
        }
    }, [])

    const handleRegister = (event) => {
        event.preventDefault()

        const existingUsers = JSON.parse(localStorage.getItem("users")) || []
        
        const foundUser = existingUsers.find(user => user.username === username)
        if (!foundUser) {
            alert("Username does not exist")
            return
        }
        if (foundUser.password !== password) { 
            alert("Password is wrong")
            return
        }

        const logUser = { username: username }
        localStorage.setItem("login", JSON.stringify(logUser))
        router.push('/quiz')
    }

    return (
        <div className="h-svh">
            <div className="flex flex-col justify-center items-center h-full gap-6 w-full">
                <h1 className="text-white text-5xl font-bold">Login</h1>
                <form className="flex flex-col gap-4 w-[320px] md:w-[400px]" onSubmit={handleRegister}>
                    <div className="flex flex-col">
                        <label className="text-white text-xl font-semibold mb-2">Username</label>
                        <input onChange={e => setUsername(e.target.value)} type="text" required className="p-2 rounded-md"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-white text-xl font-semibold mb-2">Password</label>
                        <input onChange={e => setPassword(e.target.value)} type="password" required className="p-2 rounded-md"/>
                    </div>
                    <button type="submit" className="bg-gradient-to-b from-green-300 to-green-400 w-fit mx-auto px-12 py-2 rounded-md text-white font-semibold text-xl mt-6">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}
