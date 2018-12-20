let express=require('express');
let mongoose=require('mongoose');
let config=require('config');
let schema=require('../schema');
let route=express.Router();

mongoose.connect("mongodb://localhost:27017/FeedBack")
        .then(()=>console.log("Connected to DB"))
        .catch((err)=>console.log(new Error("Error while connecting")));
let Users=[
    {id:1,name:"Ashok"},
    {id:2,name:"Anil"},
    {id:3,name:"Trisha"}
];

let _users=schema.UserSchema;

let UserModel=mongoose.model("user",_users);

let _dept=schema.DepartmentSchema;
let DeptModel=mongoose.model("dept",_dept);

route.get('/',(req,res)=>{
    //getUsers(res);
    try{
    UserModel.find({},(err,user)=>{
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

route.get('/maxage',(req,res)=>{
    //getUsers(res);
    UserModel.find({age:{ $gt:35 }},(err,user)=>{
        if(user)
          res.status(200).send(user);
        else{
            res.status(404).send(new Error("Empty List"))
        }
    });
});



async function demopopulate(){
     let result=await DeptModel.find().populate('people');
    // console.log(result);
     return result;
}


route.get('/dep',(req,res)=>{
      DeptModel.find().populate('people')
                .exec((err,dept)=>{
                    if(dept)
                       res.status(200).send(dept);
                    else   
                    res.status(404).send(new Error("Empty List"));
        });
                //res.status(200).send(demopopulate()); 
});

route.get('/:id',(req,res)=>{
    UserModel.find({id:req.params.id},(err,user)=>{
        if(user.length)
        res.status(200).send(user);
      else{
          res.status(404).send(new Error("User not found"))
      }
    });
});
route.post('/',(req,res)=>{
    try{
        console.log(req.body);
    let _user=new UserModel({
        id:req.body.id,
        name:req.body.name,
        age:req.body.age,
        education:req.body.education,
        department:req.body.department
    });
    _user.save()
        .then(()=>{
             res.status(200).send("Success");
    }).catch(()=>{
             res.status(404).send(new Error("Error while inserting"));
    }); 
    }
    catch(e){
        console.log("Error",e.errors);
    }
       
});



route.post('/dep',(req,res)=>{
    try{
        console.log(req.body);
    let _department=new DeptModel({        
        depname:req.body.depname,
        user:req.body.user       
    });
    _department.save()
        .then(()=>{
             res.status(200).send("Success");
    }).catch(()=>{
             res.status(404).send(new Error("Error while inserting"));
    }); 
    }
    catch(e){
        console.log("Error",e.errors);
    }
       
});


route.put('/:id',(req,res)=>{
    UserModel.update({id:req.params.id},{$set:{
        name:req.body.name,
        age:req.body.age,
        education:req.body.education,
        department:req.body.department
    }})
    .then((result)=>{
            res.send(result);
    })
    .catch((err)=>{
        res.status(404).send(new Error("Error while updating"));
    })
     
});

route.delete('/:id',(req,res)=>{
    UserModel.deleteMany({id:req.params.id})
    .then((result)=>{
            res.send(result);
    })
    .catch((err)=>{
        res.status(404).send(new Error("Error while deleting"));
    })
     
});

module.exports=route;