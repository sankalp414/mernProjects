import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: 'dlcbn4cj4', 
    api_key: '262723822314978', 
    api_secret: 'xxbRjyqjrOJfxfSCYEwmfKUAJS4'
});

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) null
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:auto
        })
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null ;       
    }

}

export{uploadOnCloudinary}