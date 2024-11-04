import React from 'react'
import { Link } from 'react-router-dom'

import styles from '../HeaderComponent.module.css'

interface Props {}

const AccountComponent: React.FC<Props> = (props) => {
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
