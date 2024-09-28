import { type FC, type FormEvent, useRef, useState } from 'react'
import { type Question, calculateAnswer } from './quiz.controller'

import classes from './Quiz.module.css'

interface QuizQuestionProps {
	question: Question
	onAnswer: (isCorrect: boolean) => void
}

export const QuizQuestion: FC<QuizQuestionProps> = ({ question, onAnswer }) => {
	const [userAnswer, setUserAnswer] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()

		if (userAnswer === '') return

		const isCorrect = Number.parseInt(userAnswer) === calculateAnswer(question)

		onAnswer(isCorrect)
		setUserAnswer('')
		inputRef.current?.focus()
	}

	return (
		<form onSubmit={handleSubmit}>
			<p className={classes.question}>
				<span>{question.num1}</span>
				<span>{question.operation}</span>
				<span>{question.num2}</span>
				<span>=</span>
				<input
					type="number"
					placeholder="???"
					value={userAnswer}
					autoFocus
					ref={inputRef}
					onChange={(e) => setUserAnswer(e.target.value)}
				/>
			</p>
		</form>
	)
}
