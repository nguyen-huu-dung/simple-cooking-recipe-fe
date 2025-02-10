import { useEffect, useState } from 'react';

export const getRandomColor = () => {
    const hexNumber = Math.random().toString(16);
    const hexColor = `#${hexNumber.substring(hexNumber.length - 6)}`;
    return hexColor;
};

// bgColor is hex color
export const getTextColorFromBgColor = (bgColor: string) => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Formula for perceived brightness
    return brightness > 128 ? '#000000' : '#FFFFFF'; // Return black for light backgrounds, white for dark ones
};

interface UseGenerateRandomColorProps {
    isGetFirst?: boolean
}

export const useGenerateRandomColor = (props?: UseGenerateRandomColorProps) => {
    const [color, setColor] = useState<string>('');

    const generateColor = () => {
        const color = getRandomColor();
        setColor(color);
    };

    useEffect(() => {
        props?.isGetFirst && generateColor();
    }, []);

    return { color, generateColor };
};
