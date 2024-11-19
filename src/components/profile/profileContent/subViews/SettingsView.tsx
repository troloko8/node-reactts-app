import React, { ChangeEvent, Dispatch, useEffect, useState } from 'react'
import { useAuthContext } from '../../../global/useAuthContext'

import global from './../../../global/global.module.css'
import styles from './SettingsView.module.css'

interface Props {}

const SettingsView: React.FC<Props> = (props) => {
    const { user } = useAuthContext()

    const [name, setName] = useState<string>(user?.name ?? '')
    const [email, setEmail] = useState<string>(user?.email ?? '')

    const [curPass, setCurPass] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [confirmPass, setConfirmPass] = useState<string>('')

    useEffect(() => {
        setName(user?.name ?? '')

        setEmail(user?.email ?? '')
        //FIXME photo
    }, [user])

    return (
        <div className={styles.settings}>
            <AccountView {...{ name, email, setName, setEmail }} />
            <PasswordView
                {...{
                    curPass,
                    setCurPass,
                    pass,
                    setPass,
                    confirmPass,
                    setConfirmPass,
                }}
            />
        </div>
    )
}

const AccountView: React.FC<{
    name: string
    email: string
    setName: Dispatch<string>
    setEmail: Dispatch<string>
}> = ({ name, email, setName, setEmail }) => {
    const nameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setName(e.target.value)
    }

    const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    return (
        <div className="settings__box">
            <h2 className={global.title_secondary}>Your Account Settings</h2>
            <form action="" className={global.form}>
                <InputBoxView
                    type="text"
                    value={name}
                    labelFor="name"
                    labelTitle="Name"
                    id="name"
                    isRequired={true}
                    setValue={nameHandler}
                />
                <InputBoxView
                    type="email"
                    value={email}
                    labelFor="email"
                    labelTitle="Email"
                    id="email"
                    isRequired={true}
                    setValue={emailHandler}
                />

                <div className="settings__userPhoto">
                    <img src="" alt="" className="settings__picture" />
                    <input
                        className={global.form__upload}
                        type="file"
                        accept="image/*"
                        id="photo"
                        name="photo"
                    />
                    <label htmlFor="photo" className={global.btn_text}>
                        Choose a new photo
                    </label>
                </div>
            </form>
        </div>
    )
}

const PasswordView: React.FC<{
    curPass: string
    pass: string
    confirmPass: string
    setCurPass: Dispatch<string>
    setPass: Dispatch<string>
    setConfirmPass: Dispatch<string>
}> = ({ curPass, setCurPass, pass, setPass, confirmPass, setConfirmPass }) => {
    const curPassHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCurPass(e.target.value)
    }

    const passHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setPass(e.target.value)
    }

    const confirmPassHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setConfirmPass(e.target.value)
    }

    return (
        <div className="settings__box">
            <h2 className={global.title_secondary}>Password Change</h2>
            <form action="" className="form settings__form">
                <InputBoxView
                    type="password"
                    value={curPass}
                    labelFor="password-current"
                    labelTitle="Current password"
                    id="password-current"
                    isRequired={true}
                    setValue={curPassHandler}
                    placeholder="***********"
                />

                <InputBoxView
                    type="password"
                    value={pass}
                    labelFor="password"
                    labelTitle="New password"
                    id="password"
                    isRequired={true}
                    setValue={passHandler}
                    placeholder="***********"
                />

                <InputBoxView
                    type="password"
                    value={confirmPass}
                    labelFor="password-confirm"
                    labelTitle="Confirm password"
                    id="password-confirm"
                    isRequired={true}
                    setValue={confirmPassHandler}
                    placeholder="***********"
                />
            </form>
        </div>
    )
}

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

export default SettingsView
