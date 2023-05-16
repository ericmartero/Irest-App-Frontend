export const updateImage = async(image) => {
    try {
        const formData = new FormData();
        formData.append('upload_preset', 'curso-vue');
        formData.append('file', image);

        const url = 'https://api.cloudinary.com/v1_1/djwjh0wpw/image/upload';
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