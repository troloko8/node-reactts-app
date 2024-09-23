import React from 'react'
import AccountComponent from './account/AccountComponent.js'

interface Props {
    some?: string
}

const HeaderComponent: React.FC<Props> = (props) => {
    return (
        <header>
            <ToursBtnComponent />
            <LogoComponent />
            <AccountComponent />
        </header>
    )
}

const ToursBtnComponent: React.FC<Props> = (props) => {
    return <div></div>
}

const LogoComponent: React.FC<Props> = (props) => {
    return <div></div>
}

export default HeaderComponent
