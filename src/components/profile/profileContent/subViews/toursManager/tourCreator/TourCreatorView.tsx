import React, { useEffect, useReducer } from 'react'

import global from './../../../../../global/global.module.css'
import styles from './TourCreatorView.module.css'
import { InputBoxView } from '../../../../../global/components/InputBoxView'
import { TextAreaBoxView } from '../../../../../global/components/TextAreaBoxView'

interface Props {}

// Define the initial state
const initialState = {
    title: '',
    about: '',
    imgCover: '',
    // images: '',
    city: '',
    duration: '',
    difficulty: '',
    // facts: null, // todo,
    // guides: null,
}

// Define a reducer function
// type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' }
type Action = {
    type: 'title' | 'about' | 'imgCover' | 'city' | 'duration' | 'difficulty'
    value: string
}

enum DifficultyTypes {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

enum GuideTypes {
    GUIDE = 'GUIDE',
    GUIDE_LEAD = 'GUIDE_LEAD',
}

function reducer(state: typeof initialState, action: Action) {
    switch (action.type) {
        case 'title':
            return { ...state, title: action.value }
        case 'about':
            return { ...state, about: action.value }
        case 'city':
            return { ...state, city: action.value }
        case 'duration':
            return { ...state, duration: action.value }
        case 'difficulty':
            return { ...state, difficulty: action.value }
        case 'imgCover':
            return { ...state, imgCover: action.value }
        default:
            throw new Error('Unknown action type')
    }
}

const TourCreatorView: React.FC<Props> = (props) => {
    const [tourReq, dispatch] = useReducer(reducer, initialState)

    console.log(tourReq)

    useEffect(() => {
        // dispatch({ type: 'title', value: 'sdasdsa' })
    }, [])
    return (
        <div>
            <h2
                className={`${global.title_secondary} ${styles.tourCreator__title}`}
            >
                Tour Creator
            </h2>
            <form
                action=""
                // className={`${global.form} ${styles.settings__form}`}
                className={`${global.form}`}
            >
                <InputBoxView
                    type="text"
                    value={tourReq.title}
                    labelFor="name"
                    labelTitle="Name"
                    id="name"
                    isRequired={true}
                    setValue={(e) =>
                        dispatch({ type: 'title', value: e.target.value })
                    }
                />

                <TextAreaBoxView
                    // type="text"
                    value={tourReq.about}
                    labelFor="About"
                    labelTitle="About"
                    id="About"
                    isRequired={true}
                    setValue={(e) =>
                        dispatch({ type: 'about', value: e.target.value })
                    }
                />

                <InputBoxView
                    type="text"
                    value={tourReq.city}
                    labelFor="City"
                    labelTitle="City"
                    id="City"
                    isRequired={true}
                    setValue={(e) =>
                        dispatch({ type: 'city', value: e.target.value })
                    }
                />
            </form>
        </div>
    )
}

export default TourCreatorView
