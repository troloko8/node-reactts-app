import React from 'react'
import styles from './FooterComponent.module.css'
interface Props {}

const FooterComponent: React.FC<Props> = (props) => {
    return (
        <footer className={styles.footer}>
            <LogoView />
            <NavigationComponent />
        </footer>
    )
}

const LogoView: React.FC = () => {
    return (
        <div className={styles.footer__logo}>
            <img
                src="/img/logo-green.png"
                alt="LOGO"
                className={styles.footer__picture}
            />
        </div>
    )
}

const NavigationComponent: React.FC = () => {
    return (
        <div className={styles.footer__info}>
            <ul className={styles.footer__nav}>
                <li>
                    <a href="#">About us</a>
                </li>
                <li>
                    <a href="#">Download apps</a>
                </li>
                <li>
                    <a href="#">Become a guide</a>
                </li>
                <li>
                    <a href="#">Careers</a>
                </li>
                <li>
                    <a href="#">Contact</a>
                </li>
            </ul>
            <p className={styles.footer__copyright}>
                © by Nafty. All rights reserved.
            </p>
        </div>
    )
}

export default FooterComponent
