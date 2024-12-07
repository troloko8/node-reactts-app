const multer = require('multer')
const sharp = require('sharp')
const multerS3 = require('multer-s3')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const factory = require('./handlerFactory')
const Tour = require('../models/tourModels')
const Booking = require('../models/bookingModel')

// Settings for uploading file to dist
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users')
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1]
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

// Settings for uploading file to memory more efficient way
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

exports.uploadUserPhoto = upload.single('photo')

// const resizeUserPhoto = catchAsync(async (req, res, next) => {
//     if (!req.file) return next()

//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

//     await sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/users/${req.file.filename}`)

//     next()
// })

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

exports.saveUserPhotoS3 = catchAsync(async (req, res, next) => {
    // Ensure file exists
    if (!req.file) return next()

    // Use Sharp to process the image
    const resizedImageBuffer = await sharp(req.file.buffer)
        .resize(250, 250) // Resize to 250x250
        .toFormat('jpeg') // Convert to JPEG
        .jpeg({ quality: 90 }) // Set quality to 90
        .toBuffer() // Get the processed image as a buffer

    // Define the key (filename) for the image
    const folderName = 'UserPhotos'
    // const fileKey = `${folderName}/user-${req.user.id}-${Date.now()}__DELETE.jpeg`
    const fileKey = `${folderName}/user-${req.user.id}.jpeg`

    // Upload the processed image to S3
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey, // Filename in the bucket
        Body: resizedImageBuffer, // Processed image buffer
        ContentType: 'image/jpeg', // Specify the content type
        // ACL: 'public-read', // Optional: Make the file publicly readable
    })

    await s3.send(command)

    // Construct the S3 file URL
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
    req.file.path = imageUrl

    next()
})

const filterReq = (obj, ...allowedFields) => {
    const filteredObj = {}
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) filteredObj[el] = obj[el]
    })

    return filteredObj
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1)Create Error if user POSTed password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'this route is not for password updates, Please use /updateMyPassword',
                400,
            ),
        )
    }

    // 2)Update user data
    const filteredBody = filterReq(req.body, 'name', 'email')
    // add filename as a path to find the image afterward
    // if (req.file) filteredBody.photo = req.file.filename
    if (req.file) filteredBody.photo = req.file.path

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        },
    )

    res.status(200).json({
        status: 'succes',
        data: {
            user: updatedUser,
        },
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'succes',
        data: null,
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'err',
        message: 'this route is not defined! Please use singnup',
    })
}

exports.getMyTours = catchAsync(async (req, res) => {
    // 1) find all my bookings
    const bookings = await Booking.find({ user: req.user.id })

    // // 2) find tours with the returned ids
    const tourIDs = bookings.map((el) => el.tour)

    const tours = await Tour.find({ _id: { $in: tourIDs } })

    res.status(200).json({
        status: 'succes',
        data: {
            tours,
        },
    })
})

exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
// DO not update password with this
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
