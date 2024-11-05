import React from 'react'

import styles from './LoginPageView.module.css'

interface Props {}

const LoginPageView: React.FC<Props> = (props) => {
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
                    />
                </div>
                <div className={styles.login_form__group}>
                    <button className="btn btn--green">Login</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPageView
