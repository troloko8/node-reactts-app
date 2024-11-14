import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { ApiService } from '../../services/APIService'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export interface authProps {
    isAuth: boolean
    setIsAuth: (is: boolean) => void
    authCheck: UseMutationResult<User, Error, void, unknown>
    login: UseMutationResult<LoginApiResponse, Error, LoginDataType, unknown>
    logout: UseMutationResult<User, Error, void, unknown>
    user?: User
    error?: string
}

type LoginDataType = {
    email: string
    password: string
}

const api = new ApiService()

const fetchLogIn = async ({
    email,
    password,
}: LoginDataType): Promise<LoginApiResponse> => {
    const res = await api.post<LoginApiResponse>('/users/login', {
        email,
        password,
    })
    //FIXME
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res as any
}

const fetchUser = async (): Promise<User> => {
    const { data } = await api.get<User>('/users/me', {
        withCredentials: true,
        responseType: 'json',
    })

    return data
}

const fetchUserLogOut = async (): Promise<User> => {
    const { data } = await api.get<User>('/users/logout', {
        withCredentials: true,
        responseType: 'json',
    })

    return data
}

const authContext = createContext<authProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [user, setUser] = useState<User>()
    const [error, setError] = useState<string>()

    const navigate = useNavigate()

    const loginMutation = useMutation<LoginApiResponse, Error, LoginDataType>({
        mutationFn: fetchLogIn,
        onSuccess: (data) => {
            setIsAuth(true)
            setUser(data.data.user)
            setError(undefined)

            navigate('/me')
        },
        onError: (error) => {
            console.error('Login failed:', error.message)
            setError(error.message)
        },
    })

    const isLoggedMutation = useMutation<User, Error>({
        mutationFn: fetchUser,
        onSuccess: (user) => {
            setIsAuth(true)
            setUser(user)
            setError(undefined)
        },
        onError: (error) => {
            console.error('User not found', error.message)
            setError(error.message)
        },
    })

    const logOutMutation = useMutation<User, Error>({
        mutationFn: fetchUserLogOut,
        onSuccess: (user) => {
            console.log({ user })

            setIsAuth(false)
            setUser(undefined)
            setError(undefined)
        },
        onError: (error) => {
            console.error('Logout failed:', error.message)
            setError(error.message)
        },
    })

    //FIXME
    //const logoutMutation

    useEffect(() => {
        isLoggedMutation.mutate()
    }, [])

    return (
        <authContext.Provider
            value={{
                isAuth,
                setIsAuth: (is: boolean) => setIsAuth(is),
                authCheck: isLoggedMutation,
                login: loginMutation,
                logout: logOutMutation,
                user,
                error,
            }}
        >
            {children}
        </authContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(authContext)
    if (!context) {
        throw new Error('authContext must be used within a GlobalProvider')
    }
    return context
}
