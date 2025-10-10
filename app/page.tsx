"use client"

import { useState, useEffect } from "react"
import { StartScreen } from "@/components/start-screen"
import { QuestionScreen } from "@/components/question-screen"
import { ResultsScreen } from "@/components/results-screen"
import { quizQuestions } from "@/lib/quiz-data"

type Screen = "start" | "quiz" | "results"

// Track answers for each question to allow going back
interface AnswerHistory {
  questionIndex: number
  score: number
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([])
  const [shuffledQuestions, setShuffledQuestions] = useState(quizQuestions)

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  const handleStart = () => {
    setScreen("quiz")
    setCurrentQuestionIndex(0)
    setAnswerHistory([])
    // Shuffle questions again on restart
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }

  const handleAnswer = (score: number) => {
    // Remove any future answers if user is revisiting a previous question
    const newHistory = answerHistory.filter((h) => h.questionIndex < currentQuestionIndex)

    // Add the new answer
    newHistory.push({
      questionIndex: currentQuestionIndex,
      score,
    })
    setAnswerHistory(newHistory)

    // Move to next question or show results
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setScreen("results")
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleRestart = () => {
    setScreen("start")
    setCurrentQuestionIndex(0)
    setAnswerHistory([])
  }

  // Calculate total score from answer history
  const totalScore = answerHistory.reduce((sum, answer) => sum + answer.score, 0)

  return (
    <>
      {screen === "start" && <StartScreen onStart={handleStart} />}

      {screen === "quiz" && (
        <QuestionScreen
          question={shuffledQuestions[currentQuestionIndex]}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={shuffledQuestions.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
          canGoBack={currentQuestionIndex > 0}
        />
      )}

      {screen === "results" && <ResultsScreen score={totalScore} onRestart={handleRestart} />}
    </>
  )
}
