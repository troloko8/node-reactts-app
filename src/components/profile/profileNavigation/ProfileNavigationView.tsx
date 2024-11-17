import React from 'react'
import { useAuthContext } from '../../global/useAuthContext'
import styles from './ProfileNavigationView.module.css'

import { NavLink } from 'react-router-dom'

interface Props {}

type navigationItemType = {
    icon: string
    title: string
    path: string
    isAdmin?: boolean
}

const userConfiq: navigationItemType[] = [
    { path: '/me', title: 'Settings', icon: 'settings' },
    { path: '/me/tours', title: 'My bookings', icon: 'briefcase' },
    { path: '/me/reviews', title: 'My reviews', icon: 'star' },
    { path: '/me/biling', title: 'Billing', icon: 'card' },
]

const adminConfiq = [
    {
        path: '/me/tours-manager',
        title: 'Manage tours',
        icon: 'map',
        isAdmin: true,
    },
    {
        path: '/me/users-manager',
        title: 'Manage users',
        icon: 'users',
        isAdmin: true,
    },
    {
        path: '/me/reviews-manager',
        title: 'Manage reviewss',
        icon: 'star',
        isAdmin: true,
    },
    {
        path: '/me/booking-manager',
        title: 'Manage bookings',
        icon: 'briefcase',
        isAdmin: true,
    },
]

// {('/my-tours', 'My bookings', 'briefcase')},

const ProfileNavigationView: React.FC<Props> = (props) => {
    const context = useAuthContext()

    return (
        <nav className={styles.profileNav}>
            <ul className={styles.profileNav__list}>
                {userConfiq.map((item, i) => (
                    <ProfileNavigationList key={i} {...item} />
                ))}
            </ul>

            {context.user?.role == 'admin' && (
                <div className={styles.profileNav__box}>
                    <h3 className={styles.profileNav__title}>Admin</h3>

                    <ul className={styles.profileNav__list}>
                        {adminConfiq.map((item, i) => (
                            <ProfileNavigationList key={i} {...item} />
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    )
}

const ProfileNavigationList: React.FC<navigationItemType> = (props) => {
    return (
        <li className={styles.profileNav__item}>
            <NavLink
                to={props.path}
                className={styles.profileNav__link}
                // FIXME
                // activeClassName={styles.profileNav__link_active}
            >
                <svg className={styles.profileNav__icon}>
                    <use xlinkHref={`/img/icons.svg#icon-${props.icon}`} />
                </svg>
                <span>{props.title}</span>
            </NavLink>
        </li>
    )
}

export default ProfileNavigationView
