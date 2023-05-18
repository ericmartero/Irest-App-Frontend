const CLOUDINARY_KEY = process.env.REACT_APP_CLOUDINARY_KEY;
const CLOUDINARY_STORAGE = process.env.REACT_APP_CLOUDINARY_STORAGE;

export const updateImage = async(image) => {
    try {
        const formData = new FormData();
        formData.append('upload_preset', CLOUDINARY_STORAGE);
        formData.append('file', image);

        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_KEY}/image/upload`;
        const params = {
            method: 'POST',
            body: formData,
        };

        const resp = await fetch(url, params);
        const urlImage = await resp.json();

        return urlImage.url;

    } catch (error) {
        throw error;
    }
}