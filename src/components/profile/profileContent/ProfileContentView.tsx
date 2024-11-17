import React from 'react'
import { useLocation } from 'react-router-dom'
import SettingsView from './subViews/SettingsView'
import MyBookingView from './subViews/MyBookingView'

interface Props {}

// enum ProfileCases {
//     SETTINGS = '/me',
//     TOURS = '/me/tours',
//     REVIEWS = '/me/reviews',
//     BILING = '/me/biling',
//     TOURS_MANAGER = '/me/tours-manager',
//     USERS_MANAGER = '/me/users-manager',
//     REVIEWS_MANAGER = '/me/reviews-manager',
//     booking_MANAGER = '/me/booking-manager',
// }

// TODO use progressive rendering for nav tabs
const ProfileContentView: React.FC<Props> = (props) => {
    const { pathname } = useLocation()

    {
        switch (pathname) {
            case '/me/tours': {
                return <MyBookingView />
            }
            case '/me/reviews': {
                return <div>/me/reviews</div>
            }
            case '/me/biling': {
                return <div>/me/biling</div>
            }
            case '/me/tours-manager': {
                return <div>/me/tours-manager</div>
            }
            case '/me/users-manager': {
                return <div>/me/users-manager</div>
            }
            case '/me/reviews-manager': {
                return <div>/me/reviews-manager</div>
            }
            case '/me/booking-manager': {
                return <div>/me/booking-manager</div>
            }
            default:
                return <SettingsView />
        }
    }
}

export default ProfileContentView
