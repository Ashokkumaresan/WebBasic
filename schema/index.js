let mongoose=require('mongoose');
let jwt=require('jsonwebtoken');
let config=require('config');

let UserSchema=new mongoose.Schema({
    id:{type:Number},
    name:{type:String,required:true},
    age:{type:Number},
    education:{type:String,required:true},
    department:{type:String}
},{collection:"people"});

let UserModel=mongoose.model("user",UserSchema);

let DepartmentSchema=new mongoose.Schema({
    depname:{type:String},
    user:UserSchema
},{collection:"department"});

let RegisterSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    emailid:{type:String,required:true,unique:true},
    isadmin:{type:Boolean,default:false}
},{collection:"Login"});

RegisterSchema.method.generateAuthToken=function(){
    console.log("start generateAuth");
    const token=jwt.sign({_id:this._id},config.get('mail.password'));
    return token;
}

module.exports={
    "UserSchema":UserSchema,
    "DepartmentSchema":DepartmentSchema,
    "RegisterSchema":RegisterSchema
}