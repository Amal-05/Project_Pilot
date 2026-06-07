import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export class StorageService {
  async uploadFile(file: string, folder: string) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }
  }
}
