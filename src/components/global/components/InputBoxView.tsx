import React, { ChangeEvent } from 'react'

import global from '../global.module.css'

export type InputType = {
    type: string
    value: string
    setValue: (e: ChangeEvent<HTMLInputElement>) => void
    labelFor?: string
    labelTitle?: string
    id?: string
    isRequired?: boolean
    placeholder?: string
}

export const InputBoxView: React.FC<InputType> = ({
    type,
    value,
    labelFor,
    labelTitle,
    id,
    isRequired,
    setValue,
    placeholder = '',
}) => {
    return (
        <div className={global.form__input_box}>
            <label htmlFor={labelFor} className={global.form__label}>
                {labelTitle}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                required={isRequired}
                className={global.form__input}
                onChange={(e) => setValue?.(e)}
                placeholder={placeholder}
            />
        </div>
    )
}
