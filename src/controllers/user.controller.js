import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinay.js";
import { ApiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async(req,res)=>{
//get data from user
//validation(whether it is empty or not)
//check whether user is already exist or not
//check for images ,check for avatar 
//upload them to cloudinary,avatar
//crate user object -create entry in db
//remove password and refresh token field from response 
//check for user creation 
//return res

const { fullName,email,userName,password}= req.body
console.log(email);

if([fullName,email,userName,password].some((field)=>
  field?.trim()==="")){
  throw new ApiError(400,"All fields are required")
}

const existeduser = User.findOne({
  $or:[{userName,email}]
})
if(existeduser){
  throw new ApiError(409,"User with email or userName already exist")
}
const avatarLocalPath = res.files?.avatar[0]?.path;
const coverImageLocalPath = res.files?.coverImage[0]?.path;

if(!avatarLocalPath){
  throw new ApiError(400,"Avatar file is required")
}
const avatar =await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)
if(!avatar){
  throw new ApiError(400,"Avatar file is required")
}
const user = User.create({
  avatar:avatar.url,
  coverImage:coverImage?.url||"",
  email,
  password,
  userName: userName.toLowerCase()
})
const createdUser = await User.findById(_id).select(
  "-password -refreshToken"
)
if(!createdUser){
  throw new ApiError(500,"something went wrong while registering the User")
}
return res.status(201).json(
  new ApiResponse(200,createdUser,"user registered successfully")
)
})

export {registerUser};