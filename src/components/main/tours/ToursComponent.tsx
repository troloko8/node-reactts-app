/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { useQuery } from '@tanstack/react-query'

import TourItemCompont from './tour/tourItem/TourItemCompont'
import styles from './ToursComponent.module.css'
import { ApiService } from '../../../services/APIService'

const api = new ApiService()
const fetchData = async (): Promise<Tour[]> => {
    // const { data } = await api.get<Tour[]>('tours', {
    const { data } = await api.get<Tour[]>('tours', {
        // params: { page: 1, limit: 2 },
    })

    return data
}

const ToursComponent: React.FC<unknown> = (props) => {
    const { data: toursCached } = useQuery<Tour[]>({
        queryKey: ['tours'],
    })

    const {
        data: tours,
        error,
        isLoading,
    } = useQuery<Tour[]>({
        queryKey: ['tours'],
        queryFn: fetchData,
        enabled: !!toursCached,
    })

    console.log(tours)

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading data</p>
    if (!tours?.length) return <p>Didn't find any tours</p>

    return (
        <div className={styles.card_container}>
            {tours?.map((tour, key) => (
                <TourItemCompont {...tour} key={key} />
            )) ?? 'No any items ...'}
        </div>
    )
}

export default ToursComponent
