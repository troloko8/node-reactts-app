/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'

import styles from './LoginPageView.module.css'
import { ApiService } from '../../../../services/APIService'
import { useMutation } from '@tanstack/react-query'
import { useAuthContext } from '../../../../App'
import { useNavigate } from 'react-router-dom'

interface Props {}

const api = new ApiService()

type LoginDataType = {
    email: string
    password: string
}
const fetchData = async ({
    email,
    password,
}: LoginDataType): Promise<LoginApiResponse> => {
    const res = await api.post<LoginApiResponse>('/users/login', {
        email,
        password,
    })
    //FIXME
    return res as any
}

const LoginPageView: React.FC<Props> = () => {
    const context = useAuthContext()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    // const [mutate, { isLoading, isError, error }] = useMutation<
    const loginMutation = useMutation<LoginApiResponse, Error, LoginDataType>({
        mutationFn: fetchData,
        onSuccess: (data) => {
            // console.log('Login successful:', data)
            localStorage.setItem('token', data.token)

            context.setIsAuth(true)

            navigate('/me')
        },
        onError: (error) => {
            console.error('Login failed:', error.message)
        },
    })

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
