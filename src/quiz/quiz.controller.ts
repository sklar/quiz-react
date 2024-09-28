import { useCallback, useEffect, useReducer } from 'react'

type Operation = '+' | '-'

export interface Question {
	num1: number
	num2: number
	operation: Operation
	isCorrect: boolean
}

interface QuizState {
	questions: Question[]
	currentQuestionIndex: number
	startTime: number
	timeTaken: number
	isSetComplete: boolean
}

type QuizAction =
	| { type: 'GENERATE_NEW_SET' }
	| { type: 'ANSWER_QUESTION'; payload: { isCorrect: boolean } }
	| { type: 'MOVE_TO_NEXT_QUESTION' }
	| { type: 'COMPLETE_SET' }

const NUMBER_OF_QUESTIONS = 5

const generateQuestion = (): Question => {
	const operation: Operation = Math.random() < 0.5 ? '+' : '-'
	const num1 = Math.floor(Math.random() * (operation === '+' ? 50 : 100)) + 1
	const num2 =
		Math.floor(Math.random() * (operation === '+' ? 100 - num1 : num1)) + 1

	return { num1, num2, operation, isCorrect: false }
}

export const calculateAnswer = ({
	num1,
	num2,
	operation,
}: Question): number => {
	return operation === '+' ? num1 + num2 : num1 - num2
}

const initialState: QuizState = {
	questions: [],
	currentQuestionIndex: 0,
	startTime: 0,
	timeTaken: 0,
	isSetComplete: false,
}

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
	switch (action.type) {
		case 'GENERATE_NEW_SET':
			return {
				...initialState,
				questions: Array.from(
					{ length: NUMBER_OF_QUESTIONS },
					generateQuestion,
				),
				startTime: Date.now(),
			}

		case 'ANSWER_QUESTION':
			return {
				...state,
				questions: state.questions.map((q, index) =>
					index === state.currentQuestionIndex
						? { ...q, isCorrect: action.payload.isCorrect }
						: q,
				),
			}
		case 'MOVE_TO_NEXT_QUESTION': {
			const nextIncorrectIndex = state.questions.findIndex(
				(q, index) => !q.isCorrect && index > state.currentQuestionIndex,
			)
			return {
				...state,
				currentQuestionIndex:
					nextIncorrectIndex !== -1
						? nextIncorrectIndex
						: state.questions.findIndex((q) => !q.isCorrect),
			}
		}

		case 'COMPLETE_SET':
			return {
				...state,
				isSetComplete: true,
				timeTaken: (Date.now() - state.startTime) / 1000,
			}

		default:
			return state
	}
}

export const useQuiz = () => {
	const [state, dispatch] = useReducer(quizReducer, initialState)

	const generateNewSet = useCallback(() => {
		dispatch({ type: 'GENERATE_NEW_SET' })
	}, [])

	const answerQuestion = useCallback((isCorrect: boolean) => {
		dispatch({ type: 'ANSWER_QUESTION', payload: { isCorrect } })
	}, [])

	useEffect(() => {
		if (state.questions.every((q) => q.isCorrect)) {
			dispatch({ type: 'COMPLETE_SET' })
		} else if (state.questions[state.currentQuestionIndex]?.isCorrect) {
			dispatch({ type: 'MOVE_TO_NEXT_QUESTION' })
		}
	}, [state.questions, state.currentQuestionIndex])

	return {
		...state,
		answerQuestion,
		calculateAnswer,
		generateNewSet,
	}
}
