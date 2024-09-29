import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { ApiService } from '../../../../services/APIService'
import styles from './TourComponent.module.css'

const api = new ApiService()

const fetchData = async (id: string): Promise<Tour> => {
    const { data } = await api.get<Tour>(`tours/${id}`)

    return data
}
const TourComponent: React.FC<Tour | undefined> = (props) => {
    const { data: tourCached } = useQuery<Tour>({
        queryKey: ['tour'],
    })

    const { id } = useParams()

    const {
        data: tour,
        error,
        isLoading,
    } = useQuery<Tour>({
        queryKey: ['tour'],
        queryFn: () => fetchData(id ?? ''),
        enabled: !!props ?? !!tourCached,
    })

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading data</p>
    if (!tour) return <p>Tour is not found</p>

    return (
        <div>
            <section className="section_header">
                <div className="header__hero">
                    <div className="header__hero_background"></div>
                </div>
                <div className="header__box">
                    <h1 className="header__title">
                        <span></span>
                    </h1>
                    <ul className="header__details">
                        <li className="header__details__item">
                            <svg className="header__icon"></svg>
                            <span className="header__text"></span>
                        </li>
                        <li className="header__details__item">
                            <svg className="header__icon"></svg>
                            <span className="header__text"></span>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section_tourDeascroption">
                <div className="tourOverview">
                    <div className="tourOverview__box">
                        <h2 className="tourOverview__title">Quick facts</h2>
                        <ul className="tourOverview__list">
                            <li className="tourOverview__item"></li>
                            {/* //FIXME map */}
                        </ul>
                    </div>
                    <div className="tourOverview__box">
                        <h2 className="tourOverview__title">
                            Your tour guides
                        </h2>
                        <ul className="tourOverview__list">
                            <li className="tourOverview__item"></li>
                            {/* //FIXME map */}
                        </ul>
                    </div>
                </div>

                <div className="tourAbout">
                    <h2 className="tourAbout__tiel">Your tour guides</h2>
                    {/* //FIXME map */}

                    <ul className="tourAbout__lisst">
                        <li className="tourAbout__item"></li>
                    </ul>
                </div>
            </section>

            <section className="section_tourPictures">
                <ul className="tourPictures__list">
                    {/* //FIXME map */}
                    <li className="tourPictures__item"></li>
                </ul>
            </section>

            <section className="section_reviews">
                {/* //FIXME map */}
                <ul className="reviews">
                    <li className="reviews__list"></li>
                </ul>
            </section>

            <section className="section-cta">
                <div className="cta">
                    <ul className="cta">
                        <li className="cta__item"></li>
                    </ul>
                </div>
                <div className="cta__content">
                    {/* // FIXME do the fucctuional and data from res */}
                    <h2 className="cta__title">What are you waiting for?</h2>
                    <p className="cta__text"></p>
                    <button
                        className="btn btn--green span-all-rows"
                        data-tour-id={props?._id}
                    >
                        Book tour now!
                    </button>
                </div>
            </section>
        </div>
    )
}

export default TourComponent
