import React from 'react'

import global from './../../../../global/global.module.css'
import styles from './MyToursManagerView.module.css'
import { Link } from 'react-router-dom'

interface Props {}

const MyToursManagerView: React.FC<Props> = (props) => {
    return (
        <div className={styles.toursManager}>
            <CreateBtnBiew />
            {/* TODO create btn */}
            {/* TODO Sort Optionals */}
            {/* TODO Tours */}
        </div>
    )
}

const CreateBtnBiew: React.FC = () => {
    return (
        <Link
            to="/me/tours-manager/create"
            className={`${global.btn} ${global.btn__small} ${global.btn__green}`}
        >
            Create a Tour
        </Link>
    )
}

export default MyToursManagerView
