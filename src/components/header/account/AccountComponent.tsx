import React from 'react'
import { Link } from 'react-router-dom'

import styles from '../HeaderComponent.module.css'
import { authProps, useAuthContext } from '../../global/useAuthContext'

interface Props {}

const AccountComponent: React.FC<Props> = (props) => {
    const account = useAuthContext()

    return (
        <div className={styles.authorization}>
            {account.isAuth ? <MyProfileView {...account} /> : <AuthView />}
        </div>
    )
}
const MyProfileView: React.FC<authProps> = (account) => {
    return (
        <div className={styles.authorization}>
            <button
                onClick={() => account.logout.mutate()}
                className={styles.navigation__item}
            >
                Log Out
            </button>

            <Link className={`${styles.navigation__item}`} to="/me">
                <img
                    src={`https://robohash.org/${Math.random() * 1000}`}
                    alt="Acc Photo"
                    className={styles.navigation__img}
                />
                <span>{account.user?.name ?? 'unknown'}</span>
            </Link>
        </div>
    )
}

const AuthView: React.FC = () => {
    return (
        <div className={styles.authorization}>
            <LogInBtnView />
            <SignUpBtnView />
        </div>
    )
}

const LogInBtnView: React.FC = () => {
    return (
        <Link
            to="/login"
            className={`${styles.navigation__item} ${styles.authorization__login}`}
        >
            log in
        </Link>
    )
}

const SignUpBtnView: React.FC = () => (
    <Link
        to="/signup "
        className={`${styles.navigation__item} ${styles.authorization__signup}`}
    >
        sign up
    </Link>
)

export default AccountComponent
