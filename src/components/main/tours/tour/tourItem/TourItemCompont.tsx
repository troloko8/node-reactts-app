import React from 'react'

import styles from './TourItemCompont.module.css'

interface Props extends Tour {
    imgPath?: string
}

type AddDataType = {
    title: string
    icon: string
}

const getCardConfig = (props: Props): AddDataType[] => {
    return [
        {
            title: `${props.startLocation.description}`,
            icon: '/img/icons.svg#icon-map-pin',
        },
        {
            title: `${new Date(props.startDates[0]).toLocaleString('en-us', { month: 'long', year: 'numeric' })}`,
            icon: '/img/icons.svg#icon-calendar',
        },
        {
            title: `${props.locations.length} stops`,
            icon: '/img/icons.svg#icon-flag',
        },
        {
            title: `${props.maxGroupSize} people`,
            icon: '/img/icons.svg#icon-user',
        },
    ]
}

const AddData: React.FC<Props> = (props: Props) => (
    <div className={styles.card__additional_data}>
        {getCardConfig(props).map((item, i) => (
            <div className={styles.card__add_data} key={i}>
                <svg className={styles.card__icon}>
                    <use xlinkHref={item.icon} />
                </svg>
                <span>{item.title}</span>
            </div>
        ))}
    </div>
)

const bgGradient =
    'linear-gradient(to right bottom, rgba(125, 213, 111, 0.7), rgba(40, 180, 135, 0.7))'

const TourItemCompont: React.FC<Props> = (props) => {
    const cardStyle = {
        backgroundImage: `
            ${bgGradient},
            url('https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/w/o/WOPA160517_D056-resized.jpg?crop=864%2C0%2C1728%2C2304&wid=600&hei=800&scl=2.88')
        `,
    }

    return (
        <div className={styles.card}>
            <div className={styles.card__header}>
                <div className={styles.card__picture} style={cardStyle}></div>
                <h3 className={styles.card__heading}>{props.name}</h3>
            </div>

            <div className={styles.card__details}>
                <h4 className={styles.card__sub_heading}>
                    {props.difficulty} {props.duration}-day tour
                </h4>
                <p className={styles.card_summary}>{props.summary}</p>
            </div>

            <AddData {...props} />

            <div className="card__footer">
                <p>
                    <span className="card__footer-value">{props.price}</span>|
                    <span className="card__footer-text">pre person</span>
                </p>
                <p className="card_ratings">
                    <span className="card__footer-value">
                        {props.ratingAverage}
                    </span>
                    |
                    <span className="card__footer-text">
                        rating {props.ratingsQuantity}
                    </span>
                    |
                </p>
            </div>

            <a
                href={`/tour/${props.slug}`}
                className="btn btn--gren btn--samll"
            ></a>
        </div>
    )
}

export default TourItemCompont
