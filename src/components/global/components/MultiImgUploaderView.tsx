import React, { useEffect, useState } from 'react'
import styles from './MultiImgUploaderView.module.css'
import global from '../global.module.css'

export type MultiImgUploaderViewProps = {
    setPhotoFiles: (files: File[]) => void
    title?: string
    maxFiles?: number // Optional parameter to limit the number of files
}

const MultiImgUploaderView: React.FC<MultiImgUploaderViewProps> = ({
    setPhotoFiles,
    title,
    maxFiles,
}) => {
    const [imageSrcs, setImageSrcs] = useState<string[]>([])
    const [photoFilesState, setPhotoFilesState] = useState<File[]>([])
    const randomLabelID = `photos-${Math.random().toString(36).substring(2, 9)}`

    useEffect(() => {
        setPhotoFiles(photoFilesState)
    }, [photoFilesState])

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []) // Get all selected files

        if (files.length > 0) {
            if (maxFiles && photoFilesState.length + files.length > maxFiles) {
                alert(`You can only upload up to ${maxFiles} files.`)
                return
            }

            setPhotoFilesState((prevFiles) => [...prevFiles, ...files])

            const newImageSrcs: string[] = []

            files.forEach((file) => {
                const reader = new FileReader()

                reader.onload = () => {
                    // Add the file's data URL to the newImageSrcs array
                    newImageSrcs.push(reader.result as string)

                    // Update the state with the new image sources
                    if (newImageSrcs.length === files.length) {
                        setImageSrcs((prevSrcs) => [
                            ...prevSrcs,
                            ...newImageSrcs,
                        ])
                    }
                }

                reader.readAsDataURL(file) // Read the file as a data URL
            })
        }
    }

    const handleDeleteImage = (index: number) => {
        setImageSrcs((prevSrcs) => prevSrcs.filter((_, i) => i !== index))
        setPhotoFilesState((prevFiles: File[]) =>
            prevFiles.filter((_, i) => i !== index),
        )
    }

    return (
        <div className={global.form__input_box}>
            {title && <h5 className={global.form__label}>{title}</h5>}

            <div className={styles.settings__userPhotos}>
                {imageSrcs.map((src, index) => (
                    <div
                        key={index}
                        className={styles.settings__photoContainer}
                    >
                        <img
                            src={src}
                            alt={`User Photo ${index + 1}`}
                            className={styles.settings__picture}
                        />
                        <button
                            className={styles.settings__deleteButton}
                            onClick={() => handleDeleteImage(index)}
                        >
                            &times;
                        </button>
                    </div>
                ))}

                <input
                    className={global.form__upload}
                    style={{ fontSize: 40 }}
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    id={randomLabelID}
                    // Use the randomLabelID for the input's id
                    name="photos"
                    multiple // Allow multiple file selection
                    disabled={Boolean(
                        maxFiles && photoFilesState.length >= maxFiles,
                    )} // Disable input if maxFiles limit is reached
                />
                <label htmlFor={randomLabelID} className={global.btn_text}>
                    Choose new photos
                </label>
            </div>
        </div>
    )
}

export default MultiImgUploaderView
