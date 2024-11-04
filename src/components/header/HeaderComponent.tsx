import React from 'react'
import AccountComponent from './account/AccountComponent'
import styles from './HeaderComponent.module.css'

import { Link } from 'react-router-dom'

interface Props {
    some?: string
}

const HeaderComponent: React.FC<Props> = (props) => {
    return (
        <header className={styles.header}>
            <ToursBtnComponent />
            <LogoComponent />
            <AccountComponent />
        </header>
    )
}

const ToursBtnComponent: React.FC<Props> = () => {
    return (
        <nav>
            <ul className={styles.navigation__list}>
                <li className={styles.navigation__item}>
                    <Link to="/" className={styles.navigation__link}>
                        ALL TOURS
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

const LogoComponent: React.FC<Props> = () => {
    return (
        <div className={styles.header__logo}>
            <img
                src="/img/logo-white.png"
                alt="LOGO"
                className={styles.header__logo_pic}
            />
        </div>
    )
}

export default HeaderComponent
