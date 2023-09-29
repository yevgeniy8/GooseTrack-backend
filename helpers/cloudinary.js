const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');

require('dotenv').config();

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
    secure: true,
});

const cloudinaryForImage = async req => {
    if (req.file) {
        const { path: tempUpload } = req.file;

        try {
            const { secure_url: avatarURL, public_id: idCloudAvatar } =
                await cloudinary.uploader.upload(tempUpload, {
                    folder: 'avatars',
                    transformation: {
                        width: 124,
                        height: 124,
                        gravity: 'auto',
                        crop: 'fill',
                    },
                });

            await fs.unlink(tempUpload);

            return { avatarURL, idCloudAvatar };
        } catch (error) {
            await fs.unlink(tempUpload);
            throw new Error(error.message);
        }
    }
};

module.exports = cloudinaryForImage;
