export const withPreventDefault =
    (callback: (e: React.MouseEvent) => void) => (e: React.MouseEvent) => {
        e.preventDefault()
        callback(e)
    }
