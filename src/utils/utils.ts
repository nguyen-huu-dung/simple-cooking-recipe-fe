import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: classNames.ArgumentArray) {
    return twMerge(classNames(inputs));
}

export function getAvatarFallbackName(fullName?: string) {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');

    if (names.length === 1) {
        // Trường hợp chỉ có một từ
        return `${names[0].charAt(0).toUpperCase()}${names[0].charAt(1).toUpperCase()}`;
    } else if (names.length > 1) {
        // Lấy ký tự đầu tiên của tên và họ
        const firstInitial = names[0].charAt(0).toUpperCase();
        const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }

    return '';
}

export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
