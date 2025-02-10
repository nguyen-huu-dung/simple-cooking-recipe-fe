import * as yup from 'yup';
import { ALLOW_FILE_IMAGES_EXT, FILE_SIZE_IMAGE } from '@/configs/constants';

declare module 'yup' {
    interface Schema {
        checkFileTypeByExt(message): this,
        checkFileSize(message): this
    }
}

yup.addMethod(yup.mixed, 'checkFileTypeByExt', function (message, allowExts: string[] = ALLOW_FILE_IMAGES_EXT) {
    return this.test('checkFileTypeByExt', message, function (file) {
        if (!file) {
            return true;
        }
        let extFiles: string = '';
        if (file instanceof File) {
            file = file.name;
        }

        if (file instanceof String || typeof file === 'string') {
            const ext = file.split('.').pop()?.toLowerCase();
            if (ext) {
                extFiles = ext;
            }
        }

        return allowExts.includes(extFiles);
    });
});

yup.addMethod(yup.mixed, 'checkFileSize', function (message) {
    return this.test('checkFileSize', message, function (file) {
        if (!file || !(file instanceof File)) return true;
        const size = file.size;
        return size <= FILE_SIZE_IMAGE;
    });
});

export default yup;
