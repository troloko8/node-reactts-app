import React, { ChangeEvent } from 'react'

import global from '../global.module.css'

export type NumberInputType = {
    value: number
    setValue: (value: number) => void
    labelFor?: string
    labelTitle?: string
    id?: string
    isRequired?: boolean
    isPositive?: boolean
    isNegative?: boolean
    isZero?: boolean
    allowPositiveAndNegative?: boolean
}

export const NumberInputBoxView: React.FC<NumberInputType> = ({
    value,
    setValue,
    labelFor,
    labelTitle,
    id,
    isRequired,
    isPositive,
    isNegative,
    isZero,
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        const numberValue = Number(inputValue)

        if (!isNaN(numberValue)) {
            if (isPositive && numberValue > 0) {
                setValue(numberValue)
                return
            }
            if (isNegative && numberValue < 0) {
                setValue(numberValue)
                return
            }
            if (isZero && numberValue === 0) {
                setValue(numberValue)
                return
            }
            if (!isPositive && !isNegative && !isZero) {
                setValue(numberValue)
            }
        }
    }

    return (
        <div className={global.form__input_box}>
            <label htmlFor={labelFor} className={global.form__label}>
                {labelTitle}
            </label>
            <input
                type="number"
                id={id}
                value={value}
                required={isRequired}
                className={global.form__input}
                onChange={handleChange}
            />
        </div>
    )
}
