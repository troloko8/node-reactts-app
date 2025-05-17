const multer = require('multer')
const sharp = require('sharp')
const Tour = require('../models/tourModels')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const { Buffer } = require('buffer')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// exports.checkID = (req, res, next, val) => {
//     // if (val * 1 > tours.length) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: 'Invalid ID'
//     //     })
//     // }

//     next()
// }

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
])
// as example
// upload.single('image') // - req.file
// upload.array('images', 5) // - req.files

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

exports.saveToursImages = catchAsync(async (req, res, next) => {
    //FIXME do that it will be real async procces

    await saveCoverImage(req, res, next)
    await saveImages(req, res, next)

    next()
})

const saveCoverImage = catchAsync(async (req, res, next) => {
    const { imageCover, name } = req.body

    if (!imageCover.length || !name || !req.user?._id) return next()
    const image = imageCover?.[0]
    const [, data] = image.split(',')
    if (!data) {
        throw new Error('Некорректный формат Base64 для imageCover')
    }
    const bufCover = Buffer.from(data, 'base64')
    const folderName = 'TourCovers'
    const fileKey = `${folderName}/tour-${req.body.name.replace(/\s+/g, '')}-user-${req.user._id}.jpeg`

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey, // Filename in the bucket
        Body: bufCover, // Processed image buffer
        ContentType: 'image/jpeg', // Specify the content type
    })

    await s3.send(command)

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`

    req.body.imageCover = imageUrl
})

const saveImages = catchAsync(async (req, res, next) => {
    const { images, name } = req.body

    if (!images.length || !name || !req.user?._id) return next()
    const imagesBuffer = images.map((image) => {
        const [, data] = image.split(',')

        if (!data) {
            throw new Error('Некорректный формат Base64 для imageCover')
        }
        const bufCover = Buffer.from(data, 'base64')

        return bufCover
    })

    const folderName = 'TourImages'
    const imageUrlTemplate = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
    const imageUrls = []

    await Promise.all(
        imagesBuffer.map((buffer, index) => {
            console.log('buffer: ', buffer)
            const fileKey = `${folderName}/tour-${req.body.name.replace(/\s+/g, '')}-user-${req.user._id}-image_${index + 1}.jpeg`
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileKey,
                Body: buffer,
                // Body: imagesBuffer,
                ContentType: 'image/jpeg',
            })

            imageUrls.push(imageUrlTemplate + fileKey)

            return s3.send(command)
        }),
    )

    req.body.images = imageUrls
})

//OLD CODE WITHOUT S3
exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files?.images || !req.files?.imageCover) return next()

    //1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`)

    // 2) Images
    req.body.images = []

    await Promise.all(
        req.files.images.map(async (file, index) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${++index}.jpeg`

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`)

            req.body.images.push(filename)
        }),
    )

    next()
})

exports.checkBody = (req, res, next) => {
    if ((req.body.name ?? '') === '' || (req.body.price ?? 0) === 0) {
        return res.status(404).json({
            status: 'fail',
            message: "Did't find name or price properties",
        })
    }

    next()
}

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingAverage,price'
    req.query.fields = 'price,name,ratingAverage,summary,difficulty'
    next()
}

exports.getAlltours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

// agregation pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                // _id: null, //one group with all data from DB
                // _id: { $toUpper: '$difficulty' }, // adinition manipulation
                _id: '$difficulty', // separat all agregation by this filed (will be 3 grops by each sort of difficulty)
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: {
                avgPrice: -1,
            },
        },
        // {
        //     $match: {
        //         _id: { $ne: 'easy' }, // repeating of stage and exluding {$ne} the one of created group
        //     }
        // }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1
    console.log(new Date(`${year}-01-01`))
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numOfToursStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                // erase parametr from final result
                _id: 0,
            },
        },
        {
            $sort: { month: 1 },
        },
        {
            $limit: 5,
        },
    ])

    res.status(200).json({
        status: 'success',
        data: {
            plan,
        },
    })
})

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng) {
        return next(
            new AppError(
                'Please provide latitude and longitude in latlng format',
                400,
            ),
        )
    }

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius],
            },
        },
    })

    res.status(200).json({
        status: 'success',
        length: tours.length,
        data: {
            data: tours,
        },
    })
})

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params

    const [lat, lng] = latlng.split(',')

    if (!lat || !lng) {
        return next(
            new AppError(
                'Please provide latitude and longitude in latlng format',
                400,
            ),
        )
    }

    const distances = await Tour.aggregate([
        {
            $geaNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceFields: 'distances',
            },
        },
    ])

    res.status(200).json({
        status: 'success',
        data: {
            data: distances,
        },
    })
})
