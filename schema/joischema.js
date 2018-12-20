let Joi=require('joi');
const joiregister={
    username:Joi.string().required().min(3).max(15),
    password:Joi.string().required().min(3).max(150),
    emailid:Joi.string().email().required(),
    isadmin:Joi.boolean().default(false)
}

const joisignin={
    emailid:Joi.string().min(3).max(150).required(),
    password:Joi.string().required().min(3).max(150)           
}

const joidelete={
    _id:Joi.string().min(5).max(150).required()
}

module.exports={
    "joiregister":joiregister,
    "joisignin":joisignin,
    "joidelete":joidelete
}