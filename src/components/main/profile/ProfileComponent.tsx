import React from 'react'
import ProfileNavigationComponent from './naviagation/ProfileNavigationComponent.js'
import ProfileBodyComponent from './body/ProfileBodyComponent.js'

interface Props {}

const ProfileComponent: React.FC<Props> = (props) => {
    return (
        <div>
            <ProfileNavigationComponent />
            <ProfileBodyComponent />
        </div>
    )
}

export default ProfileComponent
