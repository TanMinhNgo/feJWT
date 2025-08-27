import { useEffect } from "react";

function ScrollTop() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return null;
}

export default ScrollTop;