let jwt=require('jsonwebtoken');
let express=require('express');
let mongoose=require('mongoose');
let config=require('config');
let schema=require('../schema');
let auth=require('../initializer/auth');
let admin=require('../initializer/admin');
let Joi=require('joi');
let bcrypt = require('bcrypt');
let joischema=require('../schema/joischema');
let hash=require('../utility');
let route=express.Router();
mongoose.connect("mongodb://localhost:27017/FeedBack")
        .then(()=>console.log("Connected to DB"))
        .catch((err)=>console.log(new Error("Error while connecting")));

let _register=schema.RegisterSchema;  
let RegisterModel=mongoose.model("register",_register);    

route.get('/',auth,(req,res)=>{
    //getUsers(res);
    try{

        RegisterModel.find({},(err,user)=>{
        if(user)
          res.status(200).send(user);
        else{
            res.status(500).send(err.toString())
        }
    });
}
catch(e){
    res.status(500).send(new Error("Failed to connect"));
}
});

route.get('/me',[auth,admin],(req,res)=>{
    try{
        RegisterModel.findById(req.user._id).select("-password")
                    .then((u_details)=>{
                        res.status(200).send(u_details);
                    })
                    .catch((err)=>{
                        res.status(500).send(err.toString())
                    })
    }
    catch(err){
        res.status(500).send(err.toString())
    }
});

route.post("/",(req,res)=>{
    let _regschema=joischema.joiregister;
    let _res=Joi.validate(req.body,_regschema);
    if(_res.error){
        res.status(400).send(_res.error);
        return false;
    }
    hash(req.body.password)
         .then((_password)=>{            
             let _reg=new RegisterModel({
                username:req.body.username,
                password:_password,
                emailid:req.body.emailid
             });
            _reg.save()
                .then((user)=>{
                    //const token=jwt.sign({_id:user._id},config.get('mail.password'));
                    console.log(user);
                    const token=user.generateAuthToken();
                    res.header("x-auth-token",token).status(200).send(user);
                })
                .catch((err)=>{
                    res.status(404).send(err.errmsg);
                });
         })
        .catch((err)=>{
            res.status(404).send(err.errmsg);
        }); 
    //console.log("Register",_newp);    

});

route.post("/signin",(req,res)=>{
    let _sigschema=joischema.joisignin;
    let _res=Joi.validate(req.body,_sigschema);
    if(_res.error){
        res.status(400).send(_res.error.details[0].message);
        return false;
    }
    RegisterModel.findOne({$or:[{emailid:req.body.emailid},{username:req.body.emailid}]})
                 .then((user)=>{
                     if(user){
                       console.log(user);
                       bcrypt.compare(req.body.password,user.password)
                            .then((valid)=>{
                                console.log(valid);
                                if(!valid){
                                    res.status(400).send("Invalid Password");  
                                    return;
                                }                                
                                const token=jwt.sign({_id:user._id,isadmin:user.isadmin},config.get('mail.password'));
                                //const token=user.generateAuthToken();
                                res.status(200).send(token);
                            });
                     }
                     else{
                        res.status(400).send("Invalid Username or Password");
                     }  
                 })
                   .catch((e)=>{
                    res.status(400).send("Invalid Username or Password");
                   }); 
});

route.delete("/",[auth,admin],(req,res)=>{
    try{
     let _delschema=joischema.joidelete;
     let _res=Joi.validate(req.body,_delschema);
     if(_res.error){
        res.status(400).send(_res.error.details[0].message);
        return false;
    }
    RegisterModel.findByIdAndDelete(req.body._id)
            .then((deluser)=>{
                res.status(200).send(deluser);
            })
             .catch((e)=>{
                res.status(400).send("Error while deleting user");
             })
            }
            catch(e){
                res.status(404).send(e.errmsg);
            }
});


module.exports=route;