import React from 'react'
import { useLocation } from 'react-router-dom'
import TourComponent from './TourComponent'

const TourComponentWrapper: React.FC = () => {
    const location = useLocation()
    const tour: Tour = location.state?.tour

    return <TourComponent {...tour} /> // Pass the tour as a prop or undefined
}

export default TourComponentWrapper
