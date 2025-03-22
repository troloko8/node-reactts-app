import React, { ChangeEvent } from 'react'

import global from '../global.module.css'

export type DateInputType = {
    value: string
    setValue: (value: string) => void
    labelFor?: string
    labelTitle?: string
    id?: string
    isRequired?: boolean
}

export const updateDate = (date: Date, newDateString: string): Date => {
    const [year, month, day] = newDateString.split('-').map(Number)
    return new Date(year, month - 1, day, date.getHours(), date.getMinutes())
}

export const extractDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const convertToUTC = (date: Date): Date => {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        ),
    )
}

export const DateInputBoxView: React.FC<DateInputType> = ({
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
                type="date"
                id={id}
                value={value}
                required={isRequired}
                className={global.form__input}
                onChange={handleChange}
            />
        </div>
    )
}
