import React from 'react'
import { Outlet } from 'react-router-dom'

import ProfileNavigationView from './profileNavigation/ProfileNavigationView'
import styles from './ProfileView.module.css'

interface Props {}

const ProfileView: React.FC<Props> = (props) => {
    return (
        <div className={styles.profile}>
            <ProfileNavigationView />

            <Outlet />
            {/* <ProfileContentView /> */}
        </div>
    )
}

export default ProfileView
