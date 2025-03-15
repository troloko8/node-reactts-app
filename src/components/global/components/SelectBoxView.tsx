import React, { ChangeEvent } from 'react'

import global from '../global.module.css'

export type SelectType = {
    options: { value: string; label: string }[]
    value: string
    setValue: (e: ChangeEvent<HTMLSelectElement>) => void
    labelFor?: string
    labelTitle?: string
    id?: string
    isRequired?: boolean
}

export const SelectBoxView: React.FC<SelectType> = ({
    options,
    value,
    setValue,
    labelFor,
    labelTitle,
    id,
    isRequired,
}) => {
    return (
        <div className={global.form__input_box}>
            <label htmlFor={labelFor} className={global.form__label}>
                {labelTitle}
            </label>
            <select
                id={id}
                value={value}
                required={isRequired}
                className={global.form__select}
                onChange={(e) => setValue?.(e)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
