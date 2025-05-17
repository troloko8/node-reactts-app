import React, { ChangeEvent } from 'react'

import global from '../global.module.css'

export type TextAreaType = {
    value: string
    setValue: (e: ChangeEvent<HTMLTextAreaElement>) => void
    labelFor?: string
    labelTitle?: string
    id?: string
    isRequired?: boolean
    placeholder?: string
    rows?: number
    cols?: number
}

export const TextAreaBoxView: React.FC<TextAreaType> = ({
    value,
    setValue,
    labelFor,
    labelTitle,
    id,
    isRequired,
    placeholder = '',
    rows = 4,
    cols = 50,
}) => {
    return (
        <div className={global.form__input_box}>
            <label htmlFor={labelFor} className={global.form__label}>
                {labelTitle}
            </label>
            <textarea
                id={id}
                value={value}
                required={isRequired}
                className={global.form__textarea}
                onChange={(e) => setValue?.(e)}
                placeholder={placeholder}
                rows={rows}
                cols={cols}
                style={{ resize: 'none' }}
            />
        </div>
    )
}

export type SelectType = {
    options: { value: string; label: string }[]
    value: string
    setValue: (e: ChangeEvent<HTMLSelectElement>) => void
    labelFor?: string
    labelTitle?: string
    id?: string
    isRequired?: boolean
}
