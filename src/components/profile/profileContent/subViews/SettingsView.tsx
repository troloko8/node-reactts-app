import React, { ChangeEvent, Dispatch, useEffect, useState } from 'react'
import { useAuthContext } from '../../../global/useAuthContext'

import global from './../../../global/global.module.css'
import styles from './SettingsView.module.css'
import { ApiResponse, ApiService } from '../../../../services/APIService'
import { withPreventDefault } from '../../../global/helpers'
import { useMutation } from '@tanstack/react-query'

const api = new ApiService()

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

// FIXME add photo functional
const updateUser = async (user: UserReq) => {
    const res = await api.patch<User>('/users/updateMe', user)

    return res
}

type AccountProps = {
    name: string
    email: string
    setName: Dispatch<string>
    setEmail: Dispatch<string>
}

const AccountView: React.FC<AccountProps> = React.memo(function account({
    name,
    email,
    setName,
    setEmail,
}: AccountProps) {
    const userDataMutation = useMutation<ApiResponse<User>, Error, UserReq>({
        mutationFn: updateUser,
        onSuccess: (res) => {
            console.log({ res })
        },
        onError: (error) => {
            console.error('Logout failed:', error.message)
        },
    })

    const nameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setName(e.target.value)
    }

    const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    return (
        <div className={styles.settings__box}>
            <h2
                className={`${global.title_secondary} ${styles.settings__title}`}
            >
                Your Account Settings
            </h2>
            <form
                action=""
                className={`${global.form} ${styles.settings__form}`}
            >
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

                <div className={styles.settings__userPhoto}>
                    <img src="" alt="" className={styles.settings__picture} />
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

                <button
                    style={{ marginLeft: 'auto' }}
                    className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
                    onClick={withPreventDefault(() =>
                        userDataMutation.mutate({ name, email }),
                    )}
                >
                    Save settings
                </button>
                {/* FIXME */}
                {userDataMutation.isPending && <p>Loading...</p>}
                {userDataMutation.isError && <p>Error logging in</p>}
            </form>
        </div>
    )
})

type PasswordProps = {
    curPass: string
    pass: string
    confirmPass: string
    setCurPass: Dispatch<string>
    setPass: Dispatch<string>
    setConfirmPass: Dispatch<string>
}

type PasswordReq = {
    curPassword: string
    password: string
    passwordConfirm: string
}

const updatePassword = async (passObj: PasswordReq) => {
    const res = await api.patch<LoginApiResponse>(
        '/users/updateMyPassword',
        passObj,
    )

    return res
}

const PasswordView: React.FC<PasswordProps> = React.memo(function password({
    curPass,
    setCurPass,
    pass,
    setPass,
    confirmPass,
    setConfirmPass,
}: PasswordProps) {
    const passwordMutation = useMutation<
        ApiResponse<LoginApiResponse>,
        Error,
        PasswordReq
    >({
        mutationFn: updatePassword,
        onSuccess: (res) => {
            console.log({ res })
        },
        onError: (error) => {
            console.error('Logout failed:', error.message)
            // setError(error.message)
        },
    })

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
        <div className={styles.settings__box}>
            <h2
                className={`${global.title_secondary} ${styles.settings__title}`}
            >
                Password Change
            </h2>
            <form
                action=""
                className={`${global.form} ${styles.settings__form}`}
            >
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

                <button
                    style={{ marginLeft: 'auto' }}
                    className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
                    onClick={withPreventDefault(() => {
                        passwordMutation.mutate({
                            curPassword: curPass,
                            password: pass,
                            passwordConfirm: confirmPass,
                        })
                    })}
                >
                    Save settings
                </button>
                {/* //FIXME */}
                {passwordMutation.isPending && <p>Loading...</p>}
                {passwordMutation.isError && <p>Error logging in</p>}
            </form>
        </div>
    )
})

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
