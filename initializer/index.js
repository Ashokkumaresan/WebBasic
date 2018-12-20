//Initialize the App

function Init(req,res,next){
    console.log("App Initialized");
    next();
}

module.exports=Init;