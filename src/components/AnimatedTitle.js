import { useState, useEffect } from "react";

const AnimatedTitle = () => {
    const [text, setText] = useState("");
    const fullText = "Do you wanna find out if it’s a WordPress site?";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0, i));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return <h1 className="animated-title">{text}</h1>;
};

export default AnimatedTitle;
