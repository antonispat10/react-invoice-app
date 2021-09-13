import { MouseEvent, useEffect, useState } from "react";

const ShLink = ({ href, children, autotrigger }: { href: string; children?: any; autotrigger?: boolean }) => {
    const [key, setKey] = useState(1);
    // prevent full page reload
    const onClick = (event?: MouseEvent) => {
        if (event) event.preventDefault();
        document.querySelectorAll('a').forEach((value) => value.classList.remove('active'));
        // key to update class
        setKey(key + 1);
        // update url
        window.history.pushState({}, "", href)
        // communicate to Routes that URL has changed
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    };

    useEffect(() => {
        if (autotrigger) onClick();
    });

    return (
        <a key={key} className={`${href === window.location.pathname ? 'active' : ''}`} href={href} onClick={onClick}>
        {children}
        </a>
    );
};

export default ShLink;