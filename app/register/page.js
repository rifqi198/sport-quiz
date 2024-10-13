"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const router = useRouter()

    const handleRegister = () => {
        const existingUsers = JSON.parse(localStorage.getItem("users")) || []
        
        const newUser = { username: username, password: password }
        if(confirmPassword != password){
            alert("Password do not match")
            return
        }
        const foundUser = existingUsers.find(user => user.username === username)
        console.log(foundUser)
        if(foundUser){
            alert("Username already been used")
            return
        }

        existingUsers.push(newUser)
        localStorage.setItem("users", JSON.stringify(existingUsers))
        router.push('/login')
    }

    return(
        <div className="h-svh">
            <div className="flex flex-col justify-center items-center h-full gap-6 w-full">
                <h1 className="text-white text-5xl font-bold">Register</h1>
                <form className="flex flex-col gap-4 w-[320px] md:w-[400px]" action={handleRegister}>
                    <div className="flex flex-col">
                        <label className="text-white text-xl font-semibold mb-2">Username</label>
                        <input onChange={e => setUsername(e.target.value)} type="text" required className="p-2 rounded-md " />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-white text-xl font-semibold mb-2">Password</label>
                        <input onChange={e => setPassword(e.target.value)} type="password" required className="p-2 rounded-md" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-white text-xl font-semibold mb-2">Confirm Password</label>
                        <input onChange={e => setConfirmPassword(e.target.value)} type="password" required className="p-2 rounded-md" />
                    </div>
                    <button className="bg-gradient-to-b from-green-300 to-green-400 w-fit mx-auto px-12 py-2 rounded-md text-white font-semibold text-xl mt-6">Submit</button>
                </form>
            </div>
        </div>
    )
}