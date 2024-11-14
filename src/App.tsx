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
