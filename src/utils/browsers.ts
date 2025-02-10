export const getStorage = (key: string, isParse: boolean = false) => {
    const value = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (!isParse || !value) {
        return value;
    }
    return JSON.parse(value);
};

export const saveLocalStorage = (key: string, value: string, isStringify: boolean = false) => {
    const saveValue = isStringify ? JSON.stringify(value) : value;
    localStorage.setItem(key, saveValue);
};

export const removeStorage = (keys: string[]) => {
    if (keys.length > 0) {
        keys.forEach((key) => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
    }
};
