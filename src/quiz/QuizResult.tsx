import type { FC } from 'react'

import classes from './Quiz.module.css'

interface QuizResultProps {
	time: number
	onReload: () => void
}

export const QuizResult: FC<QuizResultProps> = ({ time, onReload }) => {
	return (
		<p className={classes.result}>
			<time
				className={classes.timer}
				aria-label="Time to complete the questions set"
			>
				{time.toFixed(0)} seconds
			</time>
			<button
				type="button"
				className={classes.button}
				aria-label="Load another set of questions"
				onClick={onReload}
			>
				Reload
			</button>
		</p>
	)
}
