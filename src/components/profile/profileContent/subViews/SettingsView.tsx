import React, { ChangeEvent, Dispatch, useEffect, useState } from 'react'
import { useAuthContext } from '../../../global/useAuthContext'

import global from './../../../global/global.module.css'
import styles from './SettingsView.module.css'
import { ApiResponse, ApiService } from '../../../../services/APIService'
import { withPreventDefault } from '../../../global/helpers'
import { useMutation } from '@tanstack/react-query'
import { TextInputBoxView } from '../../../global/components/TextInputBoxView'

const api = new ApiService()

interface Props {}

const SettingsView: React.FC<Props> = (props) => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const [curPass, setCurPass] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [confirmPass, setConfirmPass] = useState<string>('')

    return (
        <div className={styles.settings}>
            <AccountView {...{ name, email, setName, setEmail }} />
            <PasswordView
                {...{
                    curPass,
                    setCurPass,
                    pass,
                    setPass,
                    confirmPass,
                    setConfirmPass,
                }}
            />
        </div>
    )
}

// const updateUser = async (user: UserReq) => {
const updateUser = async (user: FormData) => {
    const res = await api.patch<User>('/users/updateMe', user)

    return res
}

type AccountProps = {
    name: string
    email: string
    setName: Dispatch<string>
    setEmail: Dispatch<string>
}

const AccountView: React.FC<AccountProps> = React.memo(function account({
    name,
    email,
    setName,
    setEmail,
}: AccountProps) {
    const { user } = useAuthContext()

    const [photoFile, setPhotoFile] = useState<File | undefined>()

    useEffect(() => {
        setName(user?.name ?? '')
        setEmail(user?.email ?? '')
    }, [user])

    const userDataMutation = useMutation<ApiResponse<User>, Error, FormData>({
        mutationFn: updateUser,
        onSuccess: (res) => {
            console.log({ res })
        },
        onError: (error) => {
            console.error('Logout failed:', error.message)
        },
    })

    const nameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setName(e.target.value)
    }

    const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    return (
        <div className={styles.settings__box}>
            <h2
                className={`${global.title_secondary} ${styles.settings__title}`}
            >
                Your Account Settings
            </h2>
            <form
                action=""
                className={`${global.form} ${styles.settings__form}`}
            >
                <TextInputBoxView
                    type="text"
                    value={name}
                    labelFor="name"
                    labelTitle="Name"
                    id="name"
                    isRequired={true}
                    setValue={nameHandler}
                />
                <TextInputBoxView
                    type="email"
                    value={email}
                    labelFor="email"
                    labelTitle="Email"
                    id="email"
                    isRequired={true}
                    setValue={emailHandler}
                />

                <ImgUploaderView setPhotoFile={setPhotoFile} />

                <button
                    style={{ marginLeft: 'auto' }}
                    className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
                    onClick={withPreventDefault(() => {
                        const form = new FormData()
                        form.append('name', name)
                        form.append('email', email)

                        // Append photo only if valid
                        if (photoFile) {
                            form.append('photo', photoFile)
                        } else {
                            console.warn('No photo file selected.')
                        }

                        userDataMutation.mutate(form)
                    })}
                >
                    Save settings
                </button>
                {/* FIXME */}
                {userDataMutation.isPending && <p>Loading...</p>}
                {userDataMutation.isError && <p>Error logging in</p>}
            </form>
        </div>
    )
})

interface ImgUploaderViewProps {
    setPhotoFile: React.Dispatch<File | undefined>
}

const ImgUploaderView: React.FC<ImgUploaderViewProps> = ({ setPhotoFile }) => {
    const { user } = useAuthContext()

    const [imageSrc, setImageSrc] = useState<string>('/img/default.jpg')

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] // Get the first file selected

        if (file) {
            setPhotoFile(file)

            const reader = new FileReader()

            reader.onload = () => {
                // Set the image source to the file's data URL
                setImageSrc(reader.result as string)
            }

            reader.readAsDataURL(file) // Read the file as a data URL
        }
    }

    useEffect(() => {
        setImageSrc(user?.photo ?? '/img/default.jpg')
    }, [user?.photo])

    return (
        <div className={styles.settings__userPhoto}>
            <img
                src={imageSrc}
                alt="User Photo"
                className={styles.settings__picture}
            />
            <input
                className={global.form__upload}
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                id="photo"
                name="photo"
            />
            <label htmlFor="photo" className={global.btn_text}>
                Choose a new photo
            </label>
        </div>
    )
}

type PasswordProps = {
    curPass: string
    pass: string
    confirmPass: string
    setCurPass: Dispatch<string>
    setPass: Dispatch<string>
    setConfirmPass: Dispatch<string>
}

type PasswordReq = {
    curPassword: string
    password: string
    passwordConfirm: string
}

const updatePassword = async (passObj: PasswordReq) => {
    const res = await api.patch<LoginApiResponse>(
        '/users/updateMyPassword',
        passObj,
    )

    return res
}

const PasswordView: React.FC<PasswordProps> = React.memo(function password({
    curPass,
    setCurPass,
    pass,
    setPass,
    confirmPass,
    setConfirmPass,
}: PasswordProps) {
    const passwordMutation = useMutation<
        ApiResponse<LoginApiResponse>,
        Error,
        PasswordReq
    >({
        mutationFn: updatePassword,
        onSuccess: (res) => {
            console.log({ res })
        },
        onError: (error) => {
            console.error('Logout failed:', error.message)
            // setError(error.message)
        },
    })

    const curPassHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCurPass(e.target.value)
    }

    const passHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setPass(e.target.value)
    }

    const confirmPassHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setConfirmPass(e.target.value)
    }

    return (
        <div className={styles.settings__box}>
            <h2
                className={`${global.title_secondary} ${styles.settings__title}`}
            >
                Password Change
            </h2>
            <form
                action=""
                className={`${global.form} ${styles.settings__form}`}
            >
                <TextInputBoxView
                    type="password"
                    value={curPass}
                    labelFor="password-current"
                    labelTitle="Current password"
                    id="password-current"
                    isRequired={true}
                    setValue={curPassHandler}
                    placeholder="***********"
                />

                <TextInputBoxView
                    type="password"
                    value={pass}
                    labelFor="password"
                    labelTitle="New password"
                    id="password"
                    isRequired={true}
                    setValue={passHandler}
                    placeholder="***********"
                />

                <TextInputBoxView
                    type="password"
                    value={confirmPass}
                    labelFor="password-confirm"
                    labelTitle="Confirm password"
                    id="password-confirm"
                    isRequired={true}
                    setValue={confirmPassHandler}
                    placeholder="***********"
                />

                <button
                    style={{ marginLeft: 'auto' }}
                    className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
                    onClick={withPreventDefault(() => {
                        passwordMutation.mutate({
                            curPassword: curPass,
                            password: pass,
                            passwordConfirm: confirmPass,
                        })
                    })}
                >
                    Save settings
                </button>
                {/* //FIXME */}
                {passwordMutation.isPending && <p>Loading...</p>}
                {passwordMutation.isError && <p>Error logging in</p>}
            </form>
        </div>
    )
})

export default SettingsView
