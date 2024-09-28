import type { FC } from 'react'
import type { Question } from './quiz.controller'

import classes from './Quiz.module.css'

interface QuizProgressProps {
	questions: Question[]
}

export const QuizProgress: FC<QuizProgressProps> = ({ questions }) => {
	return (
		<p className={classes.result} aria-label="Correct answers of all answers">
			{questions.filter((q) => q.isCorrect).length} of {questions.length}
		</p>
	)
}
