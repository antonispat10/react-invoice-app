import { useEffect, useState } from 'react';

const ShRoute = ({ path, children }: { path: any; children?: any }) => {
    // state to track URL and force component to re-render on change
    const [currentPath, setCurrentPath] = useState(`/${window.location.pathname.split('/')[1]}`);
    if (path.split('?').length > 1) path = path.split('?')[0]
    else path = path.split('/:')[0];

    useEffect(() => {
        // define callback as separate function so it can be removed later with cleanup function
        const onLocationChange = () => {
            const pathName = `/${window.location.pathname.split('/')[1]}`;
            // update path state to current window URL
            setCurrentPath(pathName);
        }

        // listen for popstate event
        window.addEventListener('popstate', onLocationChange);

        // clean up event listener
        return () => {
            window.removeEventListener('popstate', onLocationChange)
        };
    }, [])
    return currentPath === path
    ? children
    : null;
}

export default ShRoute;