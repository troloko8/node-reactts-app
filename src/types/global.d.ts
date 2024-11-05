type Tour = {
    id: string
    startLocation: {
        type: string
        description: string
        coordinates: [number, number]
        address: string
    }
    ratingAverage: number
    ratingsQuantity: number
    images: string[]
    startDates: string[]
    secretTour: boolean
    guides: {
        photo: string
        role: string
        _id: string
        name: string
        email: string
    }[]
    name: string
    duration: number
    maxGroupSize: number
    difficulty: string
    price: number
    summary: string
    description: string
    imageCover: string
    locations: {
        type: string
        coordinates: [number, number]
        _id: string
        description: string
        day: number
    }[]
    slug: string
    durationWeeks: number
    reviews: Review[]
    _id: string
}

type Review = {
    createdAt: string
    _id: string
    review: string
    rating: number
    user: {
        photo: string
        _id: string
        name: string
    }
    tour: string
    __v: number
    id: string
}

type LoginApiResponse = {
    status: string
    token: string
    data: {
        user: {
            photo: string
            role: string
            _id: string
            name: string
            email: string
            __v: number
            passwordChangedAt: string
        }
    }
}
