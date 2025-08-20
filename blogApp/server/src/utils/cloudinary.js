import fs from "fs"
import {v2 as cloudinary} from "cloudinary"


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async (localFilePath)=> {
        try {
            if(!localFilePath) return null
            const response = cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            
            return response

        } catch (error) {
            
            fs.unlinkSync(localFilePath) // remove th elocaly saved temperory files as the upload operation got failed
            return null

        }

    }

    export {uploadOnCloudinary}