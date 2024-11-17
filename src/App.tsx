import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './App.css'
import './normalize.css'
import ToursComponent from './components/main//tours/ToursComponent'
import TourComponentWrapper from './components/main/tours/tour/TourComponentWrapped'
import HeaderComponent from './components/header/HeaderComponent'
import FooterComponent from './components/footer/FooterComponent'
import LoginPageView from './components/main/autorization/login/LoginPageView'
import { AuthProvider } from './components/global/useAuthContext'
import ProfileView from './components/profile/ProfileView'
import ProfileContentView from './components/profile/profileContent/ProfileContentView'

function App() {
    // front for tourRow and TourFull
    //TODO create LoaderComponent for uploading new items
    return (
        <Router>
            <AuthProvider>
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
                            <Route path="/me" element={<ProfileView />}>
                                <Route index element={<ProfileContentView />} />
                                <Route
                                    path="tours"
                                    element={<ProfileContentView />}
                                />
                                <Route
                                    path="reviews"
                                    element={<ProfileContentView />}
                                />
                                <Route
                                    path="biling"
                                    element={<ProfileContentView />}
                                />
                                <Route
                                    path="tours-manager"
                                    element={<ProfileContentView />}
                                />
                                <Route
                                    path="users-manager"
                                    element={<ProfileContentView />}
                                />
                                <Route
                                    path="reviews-manager"
                                    element={<ProfileContentView />}
                                />
                                <Route
                                    path="booking-manager"
                                    element={<ProfileContentView />}
                                />
                            </Route>
                            {/* //FIXME */}
                            {/* <Route path="*" element={<NotFound />} />  */}
                        </Routes>
                    </main>
                    <FooterComponent />
                </div>
            </AuthProvider>
        </Router>
    )
}

export default App
