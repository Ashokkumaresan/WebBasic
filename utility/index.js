let bcrypt = require('bcrypt');

async function salt(_password){
   let salt= await bcrypt.genSalt(10);
   let _newpass= await bcrypt.hash(_password,salt);   
   return _newpass;
}

module.exports=salt;