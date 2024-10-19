import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Route, useParams } from 'react-router-dom'

import { ApiService } from '../../../../services/APIService'
import styles from './TourComponent.module.css'

const api = new ApiService()

const fetchData = async (id: string): Promise<Tour> => {
    const { data } = await api.get<Tour>(`tours/${id}`)
    // const data = await api.get<Tour>(`tours/${id}`)
    console.log(data)

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

    console.log(props ?? tour)

    return (
        <div>
            <section className={styles.section_header}>
                <div className={styles.header__hero}>
                    <div className={styles.header__hero_background}></div>
                    <img
                        // src={props?.imageCover ?? ''}
                        src="https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/w/o/WOPA160517_D056-resized.jpg?crop=864%2C0%2C1728%2C2304&wid=600&hei=800&scl=2.88"
                        alt="Img"
                        className={styles.header__hero_img}
                    />
                </div>
                <div className={styles.header__box}>
                    <h1 className={styles.header__title}>
                        <span>{props?.name ?? 'Unknown'}</span>
                    </h1>
                    <ul className={styles.header__details}>
                        <li className={styles.header__details__item}>
                            <svg className={styles.header__icon}>
                                <use xlinkHref="/img/icons.svg#icon-clock" />
                            </svg>
                            <span className={styles.header__text}>
                                {props?.duration ?? 0}
                            </span>
                        </li>
                        <li className={styles.header__details__item}>
                            <svg className={styles.header__icon}>
                                <use xlinkHref="/img/icons.svg#icon-map-pin" />
                            </svg>
                            <span className={styles.header__text}>
                                {props?.startLocation.description ?? 'Unknown'}
                            </span>
                        </li>
                    </ul>
                </div>
            </section>

            <section className={styles.section_tourDeascroption}>
                <div className={styles.tourOverview}>
                    <div className={styles.tourOverview__box}>
                        <h2 className={styles.tourOverview__title}>
                            Quick facts
                        </h2>
                        <FactsComponent {...(props ? props : tour)} />
                    </div>
                    <div className={styles.tourOverview__box}>
                        <h2 className={styles.tourOverview__title}>
                            Your tour guides
                        </h2>
                        <GuidsComponent {...(props ? props : tour)} />
                    </div>
                </div>

                <div className={styles.tourAbout}>
                    <h2
                        className={
                            (styles.tourAbout__title,
                            styles.tourOverview__title)
                        }
                    >
                        About {tour.name} tour
                    </h2>
                    {tour.description.split('\n').map((text, i) => (
                        <p className={styles.tourAbout__desc} key={i}>
                            {text}
                        </p>
                    ))}
                </div>
            </section>

            <section className={styles.section_tourPictures}>
                <ul className={styles.tourPictures__list}>
                    {tour.images.map((img, i) => (
                        <li className={styles.tourPictures__item} key={i}>
                            <img
                                src="https://picsum.photos/200"
                                alt="tour picture"
                                className={styles.tourPictures__img}
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <section className={styles.section_reviews}>
                {/* //FIXME map */}
                <ul className={styles.reviews}>
                    {tour.reviews.map((review, i) => (
                        <li className={styles.reviews__card} key={i}>
                            <div className={styles.reviews__avatar}>
                                <img
                                    src={`https://robohash.org/${Math.random() * 1000}`}
                                    alt="avatar"
                                    className={styles.reviews__avatar_img}
                                />
                                <h6 className={styles.reviews__user}>
                                    {review.user.name}
                                </h6>
                            </div>
                            <p className={styles.reviews__text}>
                                {review.review}
                            </p>
                            <ul className={styles.reviews__rating}>
                                {[...Array(5)].map((item, i) => (
                                    <li
                                        className={styles.reviews__star}
                                        key={i}
                                    >
                                        <svg
                                            className={`${styles.reviews__star}
                                                ${review.rating >= i + 1 ? styles.reviews__star_active : ''}`}
                                        >
                                            <use xlinkHref="/img/icons.svg#icon-star" />
                                        </svg>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={styles.section_cta}>
                <ul className={styles.cta}>
                    <li className={styles.cta__item}>
                        <img
                            src={`https://robohash.org/${Math.random() * 1000}`}
                            alt=""
                            className={`${styles.cta__img_logo} ${styles.cta__img}`}
                        />
                    </li>
                    <li className={styles.cta__item}>
                        <img
                            src={`https://robohash.org/${Math.random() * 1000}`}
                            alt=""
                            className={styles.cta__img}
                        />
                    </li>
                    <li className={styles.cta__item}>
                        <img
                            src={`https://robohash.org/${Math.random() * 1000}`}
                            alt=""
                            className={styles.cta__img}
                        />
                    </li>
                </ul>
                <div className={styles.cta__content}>
                    <h2
                        className={`${styles.cta__title} ${styles.tourOverview__title}`}
                    >
                        What are you waiting for?
                    </h2>
                    <p className={styles.cta__text}></p>
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

type FactsConfigType = {
    title: string
    value: string
    icon: string
}

const getFactsConfig = (tour: Tour): FactsConfigType[] => {
    return [
        {
            // title: `${props.startLocation.description}`,
            title: 'Next Date',
            value: `${new Date(tour.startDates?.[0]).toLocaleString('en-us', { month: 'long', year: 'numeric' })}`,
            icon: '/img/icons.svg#icon-calendar',
        },
        {
            title: 'Difficulty',
            value: tour.difficulty,
            icon: '/img/icons.svg#icon-trending-up',
        },
        {
            title: 'Participants',
            value: tour.maxGroupSize + '',
            icon: '/img/icons.svg#icon-user',
        },
        {
            title: 'Ratings',
            value: `${tour.ratingAverage} / 5`,
            icon: '/img/icons.svg#icon-star',
        },
    ]
}

const FactsComponent: React.FC<Tour> = (tour: Tour) => (
    <ul className={styles.tourOverview__list}>
        {getFactsConfig(tour).map((item, i) => (
            <li className={styles.tourOverview__item} key={i}>
                <svg className={styles.tourOverview__icon}>
                    <use xlinkHref={item.icon} />
                </svg>
                <span className={styles.tourOverview__label}>{item.title}</span>
                <span className={styles.tourOverview__text}>{item.value}</span>
            </li>
        ))}
    </ul>
)

const GuidsComponent: React.FC<Tour> = (tour: Tour) => (
    <ul className={styles.tourOverview__list}>
        {tour.guides.map((guide, i) => (
            <li className={styles.tourOverview__item} key={i}>
                <img
                    src="https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Guide"
                    className={styles.tourOverview__img}
                />
                <span className={styles.tourOverview__label}>
                    {guide.role}:
                </span>
                <span className={styles.tourOverview__text}>{guide.name}</span>
            </li>
        ))}
    </ul>

    // <ul className={styles.tourOverview__list}>
    //     {getFactsConfig(tour).map((item, i) => (
    //         <li className={styles.tourOverview__item} key={i}>
    //             <svg className={styles.tourOverview__icon}>
    //                 <use xlinkHref={item.icon} />
    //             </svg>
    //             <span className={styles.tourOverview__label}>{item.title}</span>
    //             <span className={styles.tourOverview__text}>{item.value}</span>
    //         </li>
    //     ))}
    // </ul>
)

export default TourComponent
