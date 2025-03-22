import React, { ChangeEvent } from 'react'

import global from '../global.module.css'

export type TimeInputType = {
    value: string
    setValue: (value: string) => void
    labelFor?: string
    labelTitle?: string
    id?: string
    isRequired?: boolean
}

export const updateTime = (date: Date, newTimeString: string): Date => {
    const [hours, minutes] = newTimeString.split(':').map(Number)
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
    )
}

export const extractTimeString = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
}

export const TimeInputBoxView: React.FC<TimeInputType> = ({
    value,
    setValue,
    labelFor,
    labelTitle,
    id,
    isRequired,
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    return (
        <div className={global.form__input_box}>
            <label htmlFor={labelFor} className={global.form__label}>
                {labelTitle}
            </label>
            <input
                type="time"
                id={id}
                value={value}
                required={isRequired}
                className={global.form__input}
                onChange={handleChange}
            />
        </div>
    )
}
