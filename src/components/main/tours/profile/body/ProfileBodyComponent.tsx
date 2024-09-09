import React from 'react'
import SettingsMainComponent from './profileSettings/SettingsMainComponent.js'
import SettingsPasswordComponent from './profileSettings/SettingsPasswordComponent.js'

interface Props {}

const ProfileBodyComponent: React.FC<Props> = (props) => {
    return (
        <div>
            <SettingsMainComponent />
            <SettingsPasswordComponent />
        </div>
    )
}

export default ProfileBodyComponent
