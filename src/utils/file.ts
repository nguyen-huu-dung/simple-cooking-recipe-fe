import { AxiosResponse } from 'axios';
import FileSaver from 'file-saver';

export function handleSaveFile(response: AxiosResponse) {
    try {
        const filename = decodeURI(response.headers['content-disposition'].split('filename=')[1].split(';')[0]).replaceAll('"', '');
        const type = response.headers['content-type'];
        const blob = new Blob([response.data], { type });
        FileSaver.saveAs(blob, filename);
    } catch (error) {
        console.log('error: ', error);
    }
}

interface loadFilePreviewOptions {
    callbackLoadMedia?: (duration: number) => void,
    callbackLoadImage?: (size: { width: number, height: number, src: string }) => void,
    nonFreeMemory?: boolean
}

export const loadFilePreview = (
    file: File | null,
    output: string,
    options?: loadFilePreviewOptions
): void => {
    if (!file || !(file instanceof File)) return;

    const outElement = document.getElementById(output) as HTMLImageElement | HTMLVideoElement | null;
    if (!outElement) return;

    outElement.src = URL.createObjectURL(file);

    outElement.onloadedmetadata = () => {
        if (options?.callbackLoadMedia && outElement instanceof HTMLVideoElement) {
            options?.callbackLoadMedia(outElement.duration);
        }
    };

    outElement.onload = () => {
        if (options?.callbackLoadImage && 'naturalWidth' in outElement && 'naturalHeight' in outElement) {
            options?.callbackLoadImage({ width: outElement.naturalWidth, height: outElement.naturalHeight, src: outElement.src });
        }
        !options?.nonFreeMemory && URL.revokeObjectURL(outElement.src); // free memory
    };
};
