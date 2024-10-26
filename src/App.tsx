import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './App.css'
import './normalize.css'
import ToursComponent from './components/main//tours/ToursComponent'
import TourComponentWrapper from './components/main/tours/tour/TourComponentWrapped'

function App() {
    // front for tourRow and TourFull
    //TODO create LoaderComponent for uploading new items
    return (
        <Router>
            <div className="main">
                <Routes>
                    <Route path="/" element={<ToursComponent />} />
                    <Route
                        path="/tours/:id"
                        element={<TourComponentWrapper />}
                    />
                    {/* //FIXME */}
                    {/* <Route path="*" element={<NotFound />} />  */}
                </Routes>
            </div>
        </Router>
    )
}

export default App
