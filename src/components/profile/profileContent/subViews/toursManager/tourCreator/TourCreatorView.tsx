import React, { useEffect, useReducer } from 'react'

import global from './../../../../../global/global.module.css'
import styles from './TourCreatorView.module.css'
import { TextInputBoxView } from '../../../../../global/components/TextInputBoxView'
import {
    SelectBoxView,
    TextAreaBoxView,
} from '../../../../../global/components/TextAreaBoxView'
import { NumberInputBoxView } from '../../../../../global/components/NumberInputBoxView'
import {
    DateInputBoxView,
    extractDateString,
    updateDate,
} from '../../../../../global/components/DateInputBoxView'
import {
    extractTimeString,
    TimeInputBoxView,
    updateTime,
} from '../../../../../global/components/TimeInputBoxView'
import MultiImgUploaderView from '../../../../../global/components/MultiImgUploaderView'

interface Props {}

enum GuideTypes {
    GUIDE = 'GUIDE',
    GUIDE_LEAD = 'GUIDE_LEAD',
}

interface GuideType {
    name: string
    type: GuideTypes
}

interface GuidesViewType {
    guides: GuideType[]
    dispatch: React.Dispatch<Action>
}
interface GuideItemViewProps {
    guide: GuideType
    index: number
    dispatch: React.Dispatch<Action>
    guides: GuideType[]
}

// Define the initial state
const initialState = {
    title: '',
    about: '',
    city: '',
    duration: '',
    difficulty: '',
    guides: [{ name: '', type: GuideTypes.GUIDE_LEAD }],
    dayAmount: 1,
    maxPeople: 1,
    startDate: new Date(),
    imgCover: [],
    images: [],
}

type Action =
    | { type: 'title'; value: string }
    | { type: 'about'; value: string }
    | { type: 'city'; value: string }
    | { type: 'duration'; value: string }
    | { type: 'difficulty'; value: string }
    | { type: 'guides'; value: GuideType[] }
    | { type: 'dayAmount'; value: number }
    | { type: 'maxPeople'; value: number }
    | { type: 'startDate'; value: Date }
    | { type: 'imgCover'; value: File[] }
    | { type: 'images'; value: File[] }

enum DifficultyTypes {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

function reducer(state: typeof initialState, action: Action) {
    return {
        ...state,
        [action.type]: action.value,
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
            <form action="" className={`${global.form}`}>
                <div className={styles.tourCreator__box}>
                    <TextInputBoxView
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
                        value={tourReq.about}
                        labelFor="About"
                        labelTitle="About"
                        id="About"
                        isRequired={true}
                        setValue={(e) =>
                            dispatch({ type: 'about', value: e.target.value })
                        }
                    />

                    <TextInputBoxView
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

                    <SelectBoxView
                        options={[
                            { value: DifficultyTypes.EASY, label: 'Easy' },
                            { value: DifficultyTypes.MEDIUM, label: 'Medium' },
                            { value: DifficultyTypes.HARD, label: 'Hard' },
                        ]}
                        value={tourReq.difficulty}
                        setValue={(e) =>
                            dispatch({
                                type: 'difficulty',
                                value: e.target.value,
                            })
                        }
                        labelTitle="Choose a difficulty"
                        id="difficulty"
                        isRequired={true}
                    />

                    <SelectBoxView
                        options={[
                            { value: DifficultyTypes.EASY, label: 'Easy' },
                            { value: DifficultyTypes.MEDIUM, label: 'Medium' },
                            { value: DifficultyTypes.HARD, label: 'Hard' },
                        ]}
                        value={tourReq.difficulty}
                        setValue={(e) =>
                            dispatch({
                                type: 'difficulty',
                                value: e.target.value,
                            })
                        }
                        labelTitle="Choose a difficulty"
                        id="difficulty"
                        isRequired={true}
                    />

                    <NumberInputBoxView
                        value={tourReq.dayAmount}
                        setValue={(value) =>
                            dispatch({ type: 'dayAmount', value })
                        }
                        labelFor="Day Amount"
                        labelTitle="Day Amount"
                        id="day_amount"
                        isRequired={true}
                    />

                    <NumberInputBoxView
                        value={tourReq.maxPeople}
                        setValue={(value) =>
                            dispatch({ type: 'maxPeople', value })
                        }
                        labelFor="Participants Amount"
                        labelTitle="Participants Amount"
                        id="participants_amount"
                        isRequired={true}
                    />

                    <DateInputBoxView
                        value={extractDateString(tourReq.startDate)}
                        setValue={(value) => {
                            const newDate = updateDate(tourReq.startDate, value)

                            dispatch({
                                type: 'startDate',
                                value: newDate,
                            })
                        }}
                        labelFor="start_date"
                        labelTitle="Start Date"
                        id="start_date"
                        isRequired={true}
                    />

                    <TimeInputBoxView
                        value={extractTimeString(tourReq.startDate)}
                        setValue={(value) => {
                            const newDate = updateTime(tourReq.startDate, value)

                            dispatch({
                                type: 'startDate',
                                value: newDate,
                            })
                        }}
                        labelFor="start_time"
                        labelTitle="Start Time"
                        id="start_time"
                        isRequired={true}
                    />

                    <GuidesView guides={tourReq.guides} dispatch={dispatch} />

                    <MultiImgUploaderView
                        setPhotoFiles={(files) =>
                            dispatch({ type: 'imgCover', value: files })
                        }
                        maxFiles={1}
                        title="Cover Image"
                    />

                    <MultiImgUploaderView
                        setPhotoFiles={(files) =>
                            dispatch({ type: 'images', value: files })
                        }
                        maxFiles={3}
                        title="Other photos"
                    />
                </div>
            </form>
        </div>
    )
}

const GuidesView = ({ guides, dispatch }: GuidesViewType) => {
    return (
        <div className={styles.guides}>
            <h3 className={global.title_third}>Guides</h3>

            {guides.map((guide, index) => {
                return GuideItemView({ guide, dispatch, index, guides })
            })}

            <button
                className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
                style={{ marginRight: 'auto' }}
                onClick={() =>
                    dispatch({
                        type: 'guides',
                        value: [
                            ...guides,
                            { name: '', type: GuideTypes.GUIDE },
                        ],
                    })
                }
            >
                Add Guide
            </button>
        </div>
    )
}

const GuideItemView: React.FC<GuideItemViewProps> = ({
    guide,
    index,
    dispatch,
    guides,
}) => {
    return (
        <div key={index} className={styles.guides__box}>
            <TextInputBoxView
                type="text"
                value={guide.name}
                labelFor={`guide-name-${index}`}
                labelTitle="Name of the guide"
                id={`guide-name-${index}`}
                isRequired={true}
                setValue={(e) =>
                    dispatch({
                        type: 'guides',
                        value: guides.map((guide, i) =>
                            i === index
                                ? { ...guide, name: e.target.value }
                                : guide,
                        ),
                    })
                }
                additionalClasses={styles.guides__input}
            />

            <SelectBoxView
                options={[
                    { value: GuideTypes.GUIDE, label: 'Guide' },
                    {
                        value: GuideTypes.GUIDE_LEAD,
                        label: 'Guide Lead',
                    },
                ]}
                value={guide.type}
                setValue={(e) =>
                    dispatch({
                        type: 'guides',
                        value: guides.map((guide, i) =>
                            i === index
                                ? {
                                      ...guide,
                                      type: e.target.value as GuideTypes,
                                  }
                                : guide,
                        ),
                    })
                }
                labelTitle="Choose a difficulty"
                id="difficulty"
                isRequired={true}
            />

            <button
                className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
                style={{
                    background: 'red',
                    margin: 'auto',
                    marginBottom: '10px',
                }}
                onClick={() =>
                    dispatch({
                        type: 'guides',
                        value: [
                            ...guides.filter((_, i) => i !== index),
                            // { name: '', type: GuideTypes.GUIDE },
                        ],
                    })
                }
            >
                Delete
            </button>
        </div>
    )
}

export default TourCreatorView
