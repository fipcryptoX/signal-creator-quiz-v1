"use client"

import { useState, useEffect } from "react"
import { StartScreen } from "@/components/start-screen"
import { QuestionScreen } from "@/components/question-screen"
import { ResultsScreen } from "@/components/results-screen"
import { quizQuestions } from "@/lib/quiz-data"

type Screen = "start" | "quiz" | "results"

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState(quizQuestions)

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  const handleStart = () => {
    setScreen("quiz")
    setCurrentQuestionIndex(0)
    setTotalScore(0)
    // Shuffle questions again on restart
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }

  const handleAnswer = (score: number) => {
    setTotalScore((prev) => prev + score)

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setScreen("results")
    }
  }

  const handleRestart = () => {
    setScreen("start")
    setCurrentQuestionIndex(0)
    setTotalScore(0)
  }

  return (
    <>
      {screen === "start" && <StartScreen onStart={handleStart} />}

      {screen === "quiz" && (
        <QuestionScreen
          question={shuffledQuestions[currentQuestionIndex]}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={shuffledQuestions.length}
          onAnswer={handleAnswer}
        />
      )}

      {screen === "results" && <ResultsScreen score={totalScore} onRestart={handleRestart} />}
    </>
  )
}
