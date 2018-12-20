function clean_mem(req,res,next){
    console.log("Memory cleaned");
    next();
}

module.exports=clean_mem;