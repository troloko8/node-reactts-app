/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'

import styles from './LoginPageView.module.css'
import { useAuthContext } from '../../../global/useAuthContext'

interface Props {}

type LoginDataType = {
    email: string
    password: string
}

const LoginPageView: React.FC<Props> = () => {
    const context = useAuthContext()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginMutation = context.login

    const login = (
        // e: React.ChangeEvent<HTMLInputElement>,
        e: any,
        data: LoginDataType,
    ) => {
        e.preventDefault()
        loginMutation.mutate(data)
    }

    return (
        <div className={styles.login_form}>
            <h2 className={styles.login_form__title}>Log into your account</h2>
            <form action="" className={styles.login_form__form}>
                <div className={styles.login_form__group}>
                    <label htmlFor="email" className={styles.login_form__label}>
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={styles.login_form__input}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.login_form__group}>
                    <label
                        htmlFor="password"
                        className={styles.login_form__label}
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className={styles.login_form__input}
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className={styles.login_form__group}>
                    <button
                        onClick={(e) => login(e, { email, password })}
                        className="btn btn--green"
                    >
                        Login
                    </button>
                    {loginMutation.isPending && <p>Loading...</p>}
                    {loginMutation.isError && <p>Error logging in</p>}
                </div>
            </form>
        </div>
    )
}

export default LoginPageView
