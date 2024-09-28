import party from 'party-js'
import { type FC, useCallback, useEffect, useRef, useState } from 'react'

import { QuizQuestion } from './QuizQuestion'
import { useQuiz } from './quiz.controller'

import classes from './Quiz.module.css'

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

export const Quiz: FC = () => {
	const confettiRef = useRef<HTMLDivElement>(null)
	const [celebrationGif, setCelebrationGif] = useState('')

	const {
		answerQuestion,
		currentQuestionIndex,
		generateNewSet,
		isSetComplete,
		questions,
		timeTaken,
	} = useQuiz()

	const handleReload = useCallback(() => {
		setCelebrationGif('')
		generateNewSet()
	}, [])

	useEffect(() => {
		generateNewSet()
	}, [generateNewSet])

	useEffect(() => {
		if (isSetComplete) {
			setCelebrationGif(
				celebrationGifs[Math.floor(Math.random() * celebrationGifs.length)],
			)
			confettiRef.current &&
				party.confetti(confettiRef.current, {
					count: party.variation.range(80, 160),
				})
		}
	}, [isSetComplete])

	const currentQuestion = questions[currentQuestionIndex]

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
					<QuizQuestion question={currentQuestion} onAnswer={answerQuestion} />
				)}
			</div>
			<footer>
				{!isSetComplete ? (
					<p>
						Correct: {questions.filter((q) => q.isCorrect).length} /{' '}
						{questions.length}
					</p>
				) : (
					<>
						<p className={classes.timer}>{timeTaken.toFixed(0)} seconds</p>
						<button
							type="button"
							className={classes.button}
							onClick={handleReload}
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
