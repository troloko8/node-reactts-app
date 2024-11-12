import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import './App.css'
import './normalize.css'
import ToursComponent from './components/main//tours/ToursComponent'
import TourComponentWrapper from './components/main/tours/tour/TourComponentWrapped'
import HeaderComponent from './components/header/HeaderComponent'
import FooterComponent from './components/footer/FooterComponent'
import LoginPageView from './components/main/autorization/login/LoginPageView'
import { ApiService } from './services/APIService'
import axios from 'axios'

// authorizion
// TODO separate class for Auth
interface authProps {
    isAuth: boolean
    setIsAuth: (is: boolean) => void
    isAuthCheck: () => void
    // userToken?: string
    // setUserToken?: (token: string) => void
    error?: string
}

// TODO create a separate file for this
const authContext = createContext<authProps | undefined>(undefined)

const AuthProvider = ({ children }: { children: ReactNode }) => {
    axios.defaults.withCredentials = true

    const [userToken, setUserToken] = useState<string>('')
    const [isAuth, setIsAuth] = useState<boolean>(false)

    const api = new ApiService()
    const fetchData = async (): Promise<User> => {
        const { data } = await api.get<User>('/users/me', {
            withCredentials: true,
            responseType: 'json',
        })

        return data
    }

    const loginMutation = useMutation<User, Error>({
        mutationFn: fetchData,
        onSuccess: (data) => {
            console.log('Login successful:', data)
            // localStorage.setItem('user', JSON.stringify(data))
        },
        onError: (error) => {
            console.error('Login failed:', error.message)
        },
    })

    const isAuthCheck = () => {
        loginMutation.mutate()
    }

    useEffect(() => {
        loginMutation.mutate()
    }, [])

    return (
        <authContext.Provider
            value={{
                isAuth,
                setIsAuth: (is: boolean) => setIsAuth(is),
                isAuthCheck,
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

function App() {
    // front for tourRow and TourFull
    //TODO create LoaderComponent for uploading new items
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <HeaderComponent />
                    <main className="main">
                        <Routes>
                            <Route path="/" element={<ToursComponent />} />
                            <Route path="/login" element={<LoginPageView />} />
                            <Route
                                path="/tours/:id"
                                element={<TourComponentWrapper />}
                            />
                            {/* //FIXME */}
                            {/* <Route path="*" element={<NotFound />} />  */}
                        </Routes>
                    </main>
                    <FooterComponent />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
