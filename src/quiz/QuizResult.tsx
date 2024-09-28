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
				aria-description="Time to complete the set of answers"
			>
				{time.toFixed(0)} seconds
			</time>
			<button
				type="button"
				className={classes.button}
				aria-description="Reload another set of answers"
				onClick={onReload}
			>
				Reload
			</button>
		</p>
	)
}
