import React from 'react'
import NavigationComponent from './navigation/NavigationComponent.js'

interface Props {}

const FooterComponent: React.FC<Props> = (props) => {
    return (
        <div>
            {/* Logo */}
            <NavigationComponent />
        </div>
    )
}

export default FooterComponent
