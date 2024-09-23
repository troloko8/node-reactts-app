import React from 'react'
import { useQuery } from '@tanstack/react-query'

import TourItemCompont from './tour/tourItem/TourItemCompont'
import apiService from '../../../services/APIService'

interface Props {}

const fetchData = async (): Promise<Tour[]> => {
    // const { data } = await axios.get('http://localhost:3001/api/v1/tours')
    const { data } = await apiService.get<Tour[]>('tours', {
        // params: { page: 1, limit: 2 },
    })

    return data
}

// TODO stylish all components through new modern style way
const ToursComponent: React.FC<Props> = (props) => {
    const { data, error, isLoading } = useQuery<Tour[]>({
        queryKey: ['data'],
        queryFn: fetchData,
    })

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading data</p>

    return (
        <div>
            {data?.map((tour, key) => (
                <TourItemCompont {...tour} key={key} />
            )) ?? 'No any items ...'}
        </div>
    )
}

export default ToursComponent
