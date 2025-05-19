import React, { useReducer } from 'react'

import global from './../../../../../global/global.module.css'
import styles from './TourCreatorView.module.css'
import { TextInputBoxView } from '../../../../../global/components/TextInputBoxView'
import { TextAreaBoxView } from '../../../../../global/components/TextAreaBoxView'
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
import { ApiService } from '../../../../../../services/APIService'
import { useQuery } from '@tanstack/react-query'
import { withPreventDefault } from '../../../../../global/helpers'
import { SelectBoxView } from '../../../../../global/components/SelectBoxView'

interface Props {}

interface GuidesViewType {
    guides: User[]
    guidesPull: User[]
    dispatch: React.Dispatch<Action>
}
interface GuideItemViewProps {
    guide: User
    index: number
    dispatch: React.Dispatch<Action>
    guides: User[]
}

enum DifficultyTypes {
    EASY = 'easy',
    MEDIUM = 'medium',
    DIFFICULT = 'difficult',
}

type RawTourRequest = {
    _id?: number
    name: string
    slug?: string
    duration: number
    maxGroupSize: number
    difficulty: 'easy' | 'medium' | 'difficult'
    ratingAverage?: number
    ratingsQuantity?: number
    price: number
    priceDiscount?: number
    summary: string
    description?: string
    imageCover: string[]
    images: string[]
    createdAt?: Date
    startDates?: Date[]
    secretTour?: boolean
    startLocation?: Location
    locations?: Location[]
    guides?: User[]
}

// Define the initial state
const initialState: RawTourRequest = {
    name: 'Some Title',
    description: 'Some description',
    summary: 'Some summary',
    // city: '',
    duration: 1,
    difficulty: DifficultyTypes.EASY,
    guides: [],
    maxGroupSize: 1,
    startDates: [new Date()],
    imageCover: [],
    images: [],
    price: 1,
}

type Action =
    | { type: 'name'; value: string }
    | { type: 'description'; value: string }
    | { type: 'city'; value: string }
    | { type: 'duration'; value: number }
    | { type: 'difficulty'; value: DifficultyTypes }
    | { type: 'guides'; value: User[] }
    | { type: 'maxGroupSize'; value: number }
    | { type: 'startDates'; value: Date[] }
    | { type: 'imageCover'; value: string[] }
    | { type: 'images'; value: string[] }
    | { type: 'price'; value: number }
    | { type: 'summary'; value: string }

type TourInput = {
    name: string
    duration: number
    maxGroupSize: number
    difficulty: string
    ratingAverage?: number
    price: number
    priceDiscount?: number
    summary: string
    imageCover: string
}
// TODO add validation for all fields
function validateTour(input: RawTourRequest): string[] {
    const errors: string[] = []

    // name
    if (!input.name) {
        errors.push('A tour must have a name')
    } else {
        if (input.name.trim().length < 10) {
            errors.push(
                'A tour name must have more or equal then 10 characters',
            )
        }
        if (input.name.trim().length > 40) {
            errors.push(
                'A tour name must have less or equal then 40 characters',
            )
        }
    }

    // duration
    if (input.duration === undefined || input.duration === null) {
        errors.push('A tour must have a duration')
    }

    // maxGroupSize
    if (input.maxGroupSize === undefined || input.maxGroupSize === null) {
        errors.push('A tour must have a grop size')
    }

    // difficulty
    const allowedDifficulties = ['easy', 'medium', 'difficult']
    if (!input.difficulty) {
        errors.push('A tour must have a diffucalty')
    } else if (!allowedDifficulties.includes(input.difficulty)) {
        errors.push('Dufficulty is eather easy, medium, difficulty')
    }

    // ratingAverage
    if (input.ratingAverage !== undefined) {
        if (input.ratingAverage < 1) {
            errors.push('A rating must be above 1.0')
        }
        if (input.ratingAverage > 5) {
            errors.push('A rating must be below 5.0')
        }
    }

    // price
    if (input.price === undefined || input.price === null) {
        errors.push('A tour must have a price')
    }

    // priceDiscount
    if (
        input.priceDiscount !== undefined &&
        input.priceDiscount >= input.price
    ) {
        errors.push('dicountPrice: should be less then price')
    }

    // summary
    if (!input.summary) {
        errors.push('A tour must have a description')
    }

    // imageCover
    if (!input.imageCover) {
        errors.push('A tour must have a cover image')
    }

    return errors
}

function reducer(state: typeof initialState, action: Action) {
    return {
        ...state,
        [action.type]: action.value,
    }
}

const api = new ApiService()
const createTour = async (rawTour: RawTourRequest) => {
    const res = await api.post<Tour>('/tours', rawTour)
    return res
}

const getGuideList = async (): Promise<User[]> => {
    const res = await api.post<User[]>('users', {
        data: {
            filterBy: [{ role: ['lead-guide', 'guide'] }],
        },
    })

    return res.data
}

const TourCreatorView: React.FC<Props> = (props) => {
    const [tourReq, dispatch] = useReducer(reducer, initialState)
    const [tourError, setTourError] = React.useState<string[]>([])

    const { data: guideUsersCached } = useQuery<User[]>({
        queryKey: ['guideUsers'],
    })

    const {
        data: guideUsers,
        error,
        isLoading,
    } = useQuery<User[]>({
        queryKey: ['guideUsers'],
        queryFn: getGuideList,
        enabled: !!guideUsersCached,
    })

    return (
        <div className={styles.tourCreator}>
            <h2
                className={`${global.title_secondary} ${styles.tourCreator__title}`}
            >
                Tour Creator
            </h2>
            <form action="" className={`${global.form}`}>
                <div className={styles.tourCreator__box}>
                    <TextInputBoxView
                        type="text"
                        value={tourReq.name}
                        labelFor="name"
                        labelTitle="Name"
                        id="name"
                        isRequired={true}
                        setValue={(e) =>
                            dispatch({ type: 'name', value: e.target.value })
                        }
                    />
                    <TextAreaBoxView
                        value={tourReq.description ?? ''}
                        labelFor="About"
                        labelTitle="About"
                        id="About"
                        isRequired={true}
                        setValue={(e) =>
                            dispatch({
                                type: 'summary',
                                value: e.target.value,
                            })
                        }
                    />
                    <TextAreaBoxView
                        value={tourReq.description ?? ''}
                        labelFor="Description"
                        labelTitle="Description"
                        id="Description"
                        isRequired={true}
                        setValue={(e) =>
                            dispatch({
                                type: 'description',
                                value: e.target.value,
                            })
                        }
                    />
                    <MultiImgUploaderView
                        setPhotoFiles={async (files) =>
                            dispatch({ type: 'imageCover', value: files })
                        }
                        maxFiles={1}
                        title="Cover Image"
                    />
                    <MultiImgUploaderView
                        setPhotoFiles={async (files) =>
                            dispatch({ type: 'images', value: files })
                        }
                        maxFiles={3}
                        title="Collage photos"
                    />
                    <SelectBoxView
                        options={[
                            { value: DifficultyTypes.EASY, label: 'Easy' },
                            { value: DifficultyTypes.MEDIUM, label: 'Medium' },
                            { value: DifficultyTypes.DIFFICULT, label: 'Hard' },
                        ]}
                        value={tourReq.difficulty}
                        setValue={(e) =>
                            dispatch({
                                type: 'difficulty',
                                value: e.target.value as DifficultyTypes,
                            })
                        }
                        labelTitle="Choose a difficulty"
                        id="difficulty"
                        isRequired={true}
                    />

                    <NumberInputBoxView
                        value={tourReq.duration}
                        setValue={(value) =>
                            dispatch({ type: 'duration', value })
                        }
                        labelFor="Day Amount"
                        labelTitle="Day Amount"
                        id="day_amount"
                        isRequired={true}
                    />

                    <NumberInputBoxView
                        value={tourReq.maxGroupSize}
                        setValue={(value) =>
                            dispatch({ type: 'maxGroupSize', value })
                        }
                        labelFor="Participants Amount"
                        labelTitle="Participants Amount"
                        id="participants_amount"
                        isRequired={true}
                    />

                    {/* <GuidesView guides={tourReq.guides} dispatch={dispatch} /> */}
                    <GuidesView
                        guides={tourReq.guides ?? []}
                        guidesPull={guideUsers ?? []}
                        dispatch={dispatch}
                    />

                    <DateInputBoxView
                        value={extractDateString(
                            tourReq.startDates?.[0] ?? new Date(),
                        )}
                        setValue={(value) => {
                            const newDate = updateDate(
                                tourReq.startDates?.[0] ?? new Date(),
                                value,
                            )

                            dispatch({
                                type: 'startDates',
                                value: [newDate],
                            })
                        }}
                        labelFor="start_date"
                        labelTitle="Start Date"
                        id="start_date"
                        isRequired={true}
                    />

                    <TimeInputBoxView
                        value={extractTimeString(
                            tourReq.startDates?.[0] ?? new Date(),
                        )}
                        setValue={(value) => {
                            const newDate = updateTime(
                                tourReq.startDates?.[0] ?? new Date(),
                                value,
                            )

                            dispatch({
                                type: 'startDates',
                                value: [newDate],
                            })
                        }}
                        labelFor="start_time"
                        labelTitle="Start Time"
                        id="start_time"
                        isRequired={true}
                    />

                    <NumberInputBoxView
                        value={tourReq.price}
                        setValue={(value) => dispatch({ type: 'price', value })}
                        labelFor="Price"
                        labelTitle="Price"
                        id="price"
                        isRequired={true}
                    />

                    {tourError.length > 0 && (
                        <p className={global.error_message}>
                            {tourError.map((err) => (
                                <span key={err}>{err}</span>
                            ))}
                        </p>
                    )}

                    <CreateBtn tourReq={tourReq} setTourError={setTourError} />
                </div>
            </form>
        </div>
    )
}

const CreateBtn: React.FC<{
    tourReq: RawTourRequest
    setTourError: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ tourReq, setTourError }) => {
    return (
        <button
            className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
            style={{ marginRight: 'auto' }}
            onClick={withPreventDefault(() => {
                const erros = validateTour(tourReq)
                setTourError(erros)

                if (erros.length == 0) {
                    createTour(tourReq)

                    console.log('erros: ', erros)
                }
            })}
        >
            Create Tour
        </button>
    )
}

const GuidesView = ({ guides, guidesPull, dispatch }: GuidesViewType) => {
    return (
        <div className={styles.guides}>
            <h3 className={global.title_third}>Guides</h3>

            <SelectBoxView
                options={[
                    { name: 'Select', role: 'a guide' },
                    ...guidesPull,
                ].map((guide) => {
                    return {
                        value: JSON.stringify(guide),
                        label: `${guide.name} - ${guide.role ?? 'Unknwon'}`,
                    }
                })}
                value={guides[guides.length - 1]?.name ?? ''}
                setValue={(e) => {
                    console.log('res: ', JSON.parse(e.target.value))
                    dispatch({
                        type: 'guides',
                        value: [...guides, JSON.parse(e.target.value)],
                    })
                }}
                labelTitle="Choose a Guide"
                id="guides"
                isRequired={true}
            />

            {guides.map((guide, index) => {
                return GuideItemView({ guide, dispatch, index, guides })
            })}
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
            <p className={styles.guideInfo}>
                {guide.name} - {guide.role ?? 'Unknown'}
            </p>

            <button
                className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
                style={{
                    background: 'red',
                    // margin: 'auto',
                    marginBottom: '10px',
                }}
                onClick={withPreventDefault(() =>
                    dispatch({
                        type: 'guides',
                        value: [...guides.filter((_, i) => i !== index)],
                    }),
                )}
            >
                Delete
            </button>
        </div>
    )
}

export default TourCreatorView
