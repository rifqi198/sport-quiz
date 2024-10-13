"use client"
import Image from 'next/image';
import Link from 'next/link';
import sportIllustration from '../public/sports.svg'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("login")
    if(isLoggedIn){
      router.push("/quiz")
    }
  }, [])

  return (
    <div className="bg-gradient-to-b from-[#00124D] to-[#4C016E] h-svh overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center h-full lg:gap-14">
        <Image src={sportIllustration} alt="Sports" width={500} height={500} className="mb-4"/>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold text-white mb-5 lg:mb-10">Sports Quiz</h1>
          <div className="flex gap-4">
            <button className="font-semibold text-2xl bg-gradient-to-r from-green-300 to-green-400 py-2 rounded-md px-4"><Link href="/register">Register</Link></button>
            <button className="font-semibold text-2xl border-2 border-green-400  py-2 rounded-md px-4"><Link href="/login"><span className="bg-[linear-gradient(to_right,#84EEAA,#49DC7F)] bg-clip-text text-transparent">Login</span></Link></button>
          </div>
        </div>
      </div>
    </div>
  );
}
