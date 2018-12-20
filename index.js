let express=require('express');
let helmet=require('helmet');
let morgan=require('morgan');
let config=require('config');
let app=express();
let log=require('./logger');
let Clean_mem=require('./cleaner');
let AppInit=require('./initializer');
let User=require('./Usermanagement');
let Register=require('./RegisterUser');
app.use(helmet.frameguard());
app.use("/",express.static(__dirname+'/'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(AppInit);
app.use(Clean_mem);
app.use("/api/user",User);
app.use("/api/register",Register);
if(app.get('env')=='development')
   app.use(morgan('tiny'));
log.on("LogMsg",(msg)=>{
    console.log("Inherited event emitter: "+msg);
});
log.record();
console.log(`Application name ${config.get('appname')}`);
console.log(`Mail server ${config.get('mail.name')}`);
console.log(`Mail password ${config.get('mail.password')}`);

app.get("/",(req,res)=>{
    res.send("Hello World");
});


const port=process.env.PORT || 4000;
console.log(`App running in ${port}`);
app.listen(port);