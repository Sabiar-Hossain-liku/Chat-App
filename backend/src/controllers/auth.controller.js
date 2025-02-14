import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import cloudinary  from "../lib/cloudinary.js"


export const signup = async  (req, res) =>{

 const {fullName,email,password} =req.body

    try {

        if(!fullName ||!email ||!password){
            return res.status(400).json({message:"All fields are required"})
        }

        if(password.length <6){
            return res.status(400).json({messege: "Password must be atlest 6 characters"})
        }
        
        const user = await User.findOne({email})
        
        if(user) return res.status(400).json({messege:"email is already exists"})
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic:newUser.profilePic
            })
        }else{
            res.status(500).json({message: "Invalid user data"})
        }
   
   
    } catch (error) {
        

        console.log(`error in sign up controller ${error.message}`)
        res.status(500).send({messege: "Internal Server Error"})
    }
}

export const login = async (req, res) =>{

    const {email, password} = req.body

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({ message:"Invalid credentials"})
        }
        const isPasswordCorrecrt =await bcrypt.compare(password,user.password)
       
        if(!isPasswordCorrecrt){
            return res.status(400).json({ message:"Invalid credentials"})
        }
        generateToken(user._id, res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })
   
    } catch (error) {
        
        console.log(`Erorr in login controller ${error.message}`)
        res.status(500).json({message:"Internal Server error"})
    }

}
export const logout = (req, res) =>{
    try {
        res.cookie("jwt", "", { maxAge: 0 });

        res.status(200).json({message:"Logged Out successfully"})
    } catch (error) {
        console.log(`Error in logout controller ${error.message}`)
        res.status(500).json({message:"Internal Server error"})    }
}


export const updateProfile = async(req,res)=>{
    try {
        
        const {profilePic} = req.body
        const userId= res.user._id
        if(!profilePic){
            return res.status(404).json({message: "profile pic is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId , {profilePic:uploadResponse.secure_url},{new: true})
        
        res.status(200).json(updatedUser)

    } catch (error) {
        console.log(`error in update Profile ${error}`)
        res.status(500).json({message:"Failed to update profile"})
    }
}

export const checkAuth = (req, res) => {
    try {

        res.status(200).json(res.user);
        
    } catch (error) {
        console.log(`Error in checkAuth controller ${error.message}`)
        res.status(500).json({message: "Internasl Server Error"})
    }
}
