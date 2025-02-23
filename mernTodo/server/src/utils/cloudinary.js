import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const uploadCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null //if there is no localfile path then return null
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        }) // in this upload localfile path in the cloudinary 

        fs.unlinkSync(localFilePath) //then remove the the locsl file
        return response //now return the response

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the teperory saved local file as the cloudinary upload failed
        return null
    }

}

export {uploadCloudinary}