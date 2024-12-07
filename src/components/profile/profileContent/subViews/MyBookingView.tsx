/* eslint-disable react/no-unescaped-entities */
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import styles from './../../../main/tours/ToursComponent.module.css'
import { ApiService } from '../../../../services/APIService'
import TourItemCompont from '../../../main/tours/tour/tourItem/TourItemCompont'

interface Props {}

const api = new ApiService()

const fetchData = async (): Promise<Tour[]> => {
    // const { data } = await api.get<Tour[]>('tours', {
    const { data } = await api.get<{ tours: Tour[] }>('/users/myTours')

    return data.tours
}

const MyBookingView: React.FC<Props> = (props) => {
    const { data: toursCached } = useQuery<Tour[]>({
        queryKey: ['myTours'],
    })

    const {
        data: myTours,
        error,
        isLoading,
    } = useQuery<Tour[]>({
        queryKey: ['myTours'],
        queryFn: fetchData,
        enabled: !!toursCached,
    })

    console.log(myTours)
    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading data</p>
    if (!myTours?.length) return <p>Didn't find any tours</p>

    return (
        <div
            className={styles.card_container}
            style={{
                width: '100%',
            }}
        >
            {myTours?.map((tour, key) => (
                <TourItemCompont {...tour} key={key} />
            )) ?? 'No any items ...'}
        </div>
    )
}

export default MyBookingView
