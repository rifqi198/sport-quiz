"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import he from "he"

export default function Quiz() {
    const [questions, setQuestions] = useState([])
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [result, setResult] = useState({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      answeredQuestions: 0,
    })
    const [seconds, setSeconds] = useState(90)
    const router = useRouter()
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    useEffect(() => {
      const username = localStorage.getItem("login")
      if (!username) {
        router.push("/login")
        return
      }

      const storedQuestions = localStorage.getItem("quizQuestions")
      const storedProgress = localStorage.getItem("quizProgress")
      const storedTime = localStorage.getItem("time")
      const storedResults = localStorage.getItem("quizResults")

      if (storedQuestions && storedProgress) {
        setQuestions(JSON.parse(storedQuestions))
        setActiveQuestion(JSON.parse(storedProgress))
      } else {
        const getData = async () => {
            const response = await fetch("https://opentdb.com/api.php?amount=5&category=21&type=multiple")
            const data = await response.json()
            setQuestions(data.results)
        }
        getData()
        localStorage.setItem("quizProgress", JSON.stringify(0))
      }

      if (storedTime) {
        setSeconds(JSON.parse(storedTime))
      } else {
        setSeconds(90)
        localStorage.setItem("time", 90)
      }

      // Load results from local storage if they exist
      if (storedResults) {
        setResult(JSON.parse(storedResults))
      }
    }, [])

    useEffect(() => {
        if (Array.isArray(questions) && questions.length > 0) {
            localStorage.setItem("quizQuestions", JSON.stringify(questions))
        }
    }, [questions])

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prevSeconds) => {
                    const newSeconds = prevSeconds - 1
                    localStorage.setItem("time", newSeconds)
                    return newSeconds
                })
            }, 1000)
            return () => clearInterval(timer)
            } else {
                setShowResult(true)
            }
    }, [seconds])

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem("time", seconds) 
            localStorage.setItem("quizResults", JSON.stringify(result))
        }

        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [seconds, result])

    const handleNextQuestion = (selectedAnswer) => {
        const isCorrect = selectedAnswer === questions[activeQuestion]?.correct_answer
        setResult((prevResult) => ({
            ...prevResult,
            score: isCorrect ? prevResult.score + 20 : prevResult.score,
            correctAnswers: isCorrect ? prevResult.correctAnswers + 1 : prevResult.correctAnswers,
            wrongAnswers: isCorrect ? prevResult.wrongAnswers : prevResult.wrongAnswers + 1,
            answeredQuestions: prevResult.answeredQuestions + 1,
        }))

        if (activeQuestion < questions.length - 1) {
            setActiveQuestion((prevActiveQuestion) => {
                const newIndex = prevActiveQuestion + 1
                localStorage.setItem("quizProgress", JSON.stringify(newIndex))
                return newIndex
            })
        } else {
            setShowResult(true)
        }
    }

    const handleRestart = () => {
        setActiveQuestion(0)
        setShowResult(false)
        setSeconds(90)
        localStorage.setItem("time", 90)
        setResult({
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            answeredQuestions: 0,
        })
        localStorage.removeItem("quizResults")
    }

    const handleNewQuestion = async () => {
        setQuestions([])
        localStorage.removeItem("quizQuestions")
        localStorage.removeItem("quizProgress")

        const response = await fetch("https://opentdb.com/api.php?amount=5&category=21&type=multiple")
        const data = await response.json()
        setQuestions(data.results)
        setActiveQuestion(0)
        setShowResult(false)
        setSeconds(90)
        setResult({
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            answeredQuestions: 0,
        })
        localStorage.setItem("quizQuestions", JSON.stringify(data.results))
        localStorage.setItem("quizProgress", JSON.stringify(0))
        localStorage.removeItem("quizResults")
    }

    const handleLogout = () => {
        setQuestions([])
        localStorage.removeItem("quizQuestions")
        localStorage.removeItem("quizProgress")
        localStorage.removeItem("quizResults")
        localStorage.removeItem("login")
        localStorage.removeItem("time")
        setActiveQuestion(0)
        setShowResult(false)
        setSeconds(90)
        setResult({
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            answeredQuestions: 0,
        })
        router.push("/")
    }

    if (!Array.isArray(questions) || questions.length === 0 || !questions[activeQuestion]) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col items-center justify-center h-dvh gap-10 px-10 text-white">
        {!showResult ? (
            <div className="flex flex-col gap-5 w-[350px]">
                <h1 className="font-bold text-2xl">Question {activeQuestion + 1}</h1>
                <p>
                    Time Remaining: {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
                </p>
                <div>
                    <h2 className="mb-5 font-semibold text-lg">{he.decode(questions[activeQuestion].question)}</h2>
                    <ul>
                    {[...questions[activeQuestion].incorrect_answers, questions[activeQuestion].correct_answer].map((answerOption, idx) => (
                        <li
                        key={idx}
                        onClick={() => handleNextQuestion(answerOption)}
                        className="border-2 border-blue-300 px-2 py-2 mb-5 hover:bg-blue-300 cursor-pointer"
                        >
                        {he.decode(answerOption)}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        ) : (
            <div className="flex flex-col gap-5 text-lg">
            <h2 className="font-bold text-2xl">Quiz Results</h2>
            <p>Score: {result.score}</p>
            <p className="bg-green-300 px-2 rounded-lg">Correct Answers: {result.correctAnswers}</p>
            <p className="bg-red-300 px-2 rounded-lg">Wrong Answers: {result.wrongAnswers}</p>
            <p className="bg-blue-300 px-2 rounded-lg">Answered Questions: {result.answeredQuestions}</p>
            <div className="flex-col flex gap-5">
                <button onClick={handleRestart} className="bg-slate-300 font-semibold rounded-lg py-2 px-2">
                    Restart
                </button>
                <button onClick={handleNewQuestion} className="bg-yellow-300 font-semibold rounded-lg py-2 px-2">
                    New Question
                </button>
                <button onClick={handleLogout} className="bg-red-400 font-semibold rounded-lg py-2 px-2">
                    Logout
                </button>
            </div>
            </div>
        )}
        </div>
    )
}

