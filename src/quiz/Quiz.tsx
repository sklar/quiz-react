import party from 'party-js'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'

import classes from './Quiz.module.css'

type Operation = '+' | '-'

type Question = {
	num1: number
	num2: number
	operation: Operation
	isCorrect: boolean
}

const NUMBER_OF_QUESTIONS = 5

const celebrationGifs = [
	'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
	'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
	'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
	'https://media.giphy.com/media/l0MYGzh7pUL2SOyty/giphy.gif',
	'https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif',
	'https://media.giphy.com/media/cXaeWuJ1oKO4g/giphy.gif',
	'https://media.giphy.com/media/6MMxtt269tcAM/giphy.gif',
	'https://media.giphy.com/media/fwqAg6ZS6ebL2/giphy.gif',
	'https://media.giphy.com/media/DqZKCC1rRht8FmnKbv/giphy.gif',
	'https://media.giphy.com/media/Swx36wwSsU49HAnIhC/giphy.gif',
	'https://media.giphy.com/media/xDpB3lRInUYla/giphy.gif',
	'https://media.giphy.com/media/ujUdrdpX7Ok5W/giphy.gif',
]

const generateQuestion = (): Question => {
	let num1: number, num2: number
	const operation: Operation = Math.random() < 0.5 ? '+' : '-'

	if (operation === '+') {
		num1 = Math.floor(Math.random() * 50) + 1
		num2 = Math.floor(Math.random() * (100 - num1)) + 1
	} else {
		num1 = Math.floor(Math.random() * 100) + 1
		num2 = Math.floor(Math.random() * num1)
	}

	return { num1, num2, operation, isCorrect: false }
}

const calculateAnswer = (question: Question): number => {
	return question.operation === '+'
		? question.num1 + question.num2
		: question.num1 - question.num2
}

export const Quiz: FC = () => {
	const [questions, setQuestions] = useState<Question[]>([])
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [userAnswer, setUserAnswer] = useState('')
	const [startTime, setStartTime] = useState(Date.now())
	const [timeTaken, setTimeTaken] = useState(0)
	const [isSetComplete, setIsSetComplete] = useState(false)
	const [celebrationGif, setCelebrationGif] = useState('')

	const inputRef = useRef<HTMLInputElement>(null)
	const confettiRef = useRef<HTMLDivElement>(null)

	const generateNewSet = () => {
		const newQuestions = Array.from({ length: NUMBER_OF_QUESTIONS }, () =>
			generateQuestion(),
		)

		setQuestions(newQuestions)
		setCurrentQuestionIndex(0)
		setStartTime(Date.now())
		setIsSetComplete(false)
		setTimeTaken(0)
		setCelebrationGif('')
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()

		if (userAnswer === '') {
			return
		}

		const currentQuestion = questions[currentQuestionIndex]
		const correctAnswer = calculateAnswer(currentQuestion)

		if (parseInt(userAnswer) === correctAnswer) {
			const updatedQuestions = [...questions]
			updatedQuestions[currentQuestionIndex] = {
				...currentQuestion,
				isCorrect: true,
			}
			setQuestions(updatedQuestions)

			if (updatedQuestions.every((q) => q.isCorrect)) {
				const endTime = Date.now()
				setTimeTaken((endTime - startTime) / 1000) // Convert to seconds
				setIsSetComplete(true)
				const randomGif =
					celebrationGifs[Math.floor(Math.random() * celebrationGifs.length)]
				setCelebrationGif(randomGif)

				if (confettiRef.current) {
					party.confetti(confettiRef.current, {
						count: party.variation.range(80, 160),
					})
				}
			} else {
				moveToNextIncorrectQuestion(updatedQuestions)
			}
		} else {
			moveToNextIncorrectQuestion(questions)
		}

		setUserAnswer('')
		inputRef.current?.focus()
	}

	const moveToNextIncorrectQuestion = (currentQuestions: Question[]) => {
		const nextIncorrectIndex = currentQuestions.findIndex(
			(q, index) => !q.isCorrect && index > currentQuestionIndex,
		)
		if (nextIncorrectIndex !== -1) {
			setCurrentQuestionIndex(nextIncorrectIndex)
		} else {
			const firstIncorrectIndex = currentQuestions.findIndex(
				(q) => !q.isCorrect,
			)
			setCurrentQuestionIndex(
				firstIncorrectIndex !== -1 ? firstIncorrectIndex : 0,
			)
		}
	}

	const currentQuestion = questions[currentQuestionIndex]

	useEffect(() => {
		generateNewSet()
	}, [])

	return (
		<section className={classes.container}>
			<header className={classes.header}>
				<h1>Math Quiz</h1>
			</header>
			<div
				className={classes.body}
				style={{ backgroundImage: `url(${celebrationGif})` }}
			>
				{!isSetComplete && currentQuestion && (
					<form onSubmit={handleSubmit}>
						<p className={classes.question}>
							<span>{currentQuestion.num1}</span>
							<span>{currentQuestion.operation}</span>
							<span>{currentQuestion.num2}</span>
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
				)}
			</div>
			<footer>
				{!isSetComplete ? (
					<p>
						Correct: {questions.filter((q) => q.isCorrect).length} /{' '}
						{NUMBER_OF_QUESTIONS}
					</p>
				) : (
					<>
						<p className={classes.timer}>{timeTaken.toFixed(0)} seconds</p>
						<button
							type="button"
							className={classes.button}
							onClick={generateNewSet}
						>
							Reload
						</button>
					</>
				)}
			</footer>
			<div ref={confettiRef} className={classes.confetti} />
		</section>
	)
}
