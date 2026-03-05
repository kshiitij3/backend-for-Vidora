import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({
     
     email:{
      type: String,
      required: true,
      unique: true,
      trim:true,
      lowercase:true,
      index:true
     },
    userName:{
      type: String,
      required: true,
      unique: true,
      trim:true,
      lowercase:true,
      index:true
    },
    fullName:{
      type: String,
      required: true,
      trim:true,
      index:true
    },
    avatar:{
      type: String,
      required: true,
    },
    coverImage:{
      type: String //couldinary url
    },
    watchHistory:{
      type: Schema.Types.ObjectId,
      ref:"video"
    },
    password:{
      type: String,
      required: [true,'password is required'],
    },
    refreshToken:{
     type:String
    }
},{timestamps: true})
 

userSchema.pre("save",async function(next){
          if(!this.isModified(password))return next();
          this.password = bcrypt.hash(this.password,10)
          next();
  })

userSchema.methods.isPasswordcorrect = async function(password){
    return await bcrypt.compare(password,this.password)

}
userSchema.methods.genrateAccessTokens = function(){
  return jwt.sign(
    {
      _id :this._id,
      email:this.email,
      userName:this.userName,
      fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:ACCESS_TOKEN_EXPIRY,
    }
  )
}
userSchema.methods.genrateRefreshTokens=function(){
   return jwt.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:REFRESH_TOKEN_EXPIRY ,
    }
  )
}
export const User  =mongoose.model("User",userSchema)