const express = require('express')
const multer = require('multer')

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
    resizeUserPhoto,
    saveUserPhotoS3,
    getMyTours,
} = require(`../controllers/userController`)
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictToByRole,
    logout,
} = require(`../controllers/authController`)

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.use(protect)

router.patch('/updateMyPassword', updatePassword)
// router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe)
router.patch('/updateMe', uploadUserPhoto, saveUserPhotoS3, updateMe)
router.delete('/deleteMe', deleteMe)
router.get('/me', getMe, getUser)
router.get('/myTours', getMyTours)

router.use(restrictToByRole('admin'))

router.route('/').get(getAllUsers).post(getAllUsers).post(createUser)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
