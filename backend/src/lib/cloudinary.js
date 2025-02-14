import {v2 as cloudinary} from "cloudinary"


import {config} from "dotenv"

config()

cloudinary.config({
    cloud_name:process.env.CLAUDINAR_ClOUD_NAME,
    api_key:process.env.CLAUDINAR_ClOUD_KEY,
    api_secrert:process.env.CLAUDINAR_ClOUD_SECRET
})
export default cloudinary