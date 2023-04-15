const {check} = require('express-validator')
const usersRepo = require('../../repository/users')

module.exports={
    requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email)=>{
        const existingUser = await usersRepo.getOneBy({email});
        if(existingUser){ 
            throw new Error('Email is in use')
        }
    }),
    requirePassword: check('password')
    .trim()
    .isLength({min:4 , max:20})
    .withMessage("Password length should be between 4 to 20"),
    requirePasswordConfirmation:check('confirmpassword')
    .trim()
    .isLength({min:4 , max:20})
    .withMessage("Password length should be between 4 to 20")
    .custom((confirmpassword ,{req})=>{
        if(confirmpassword!==req.body.password){
            throw new Error('Password must match')
        }
    }),
    requireEmailExist:check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom( async (email)=>{
        const user = await usersRepo.getOneBy({email})
        if(!user){
            throw new Error('Email not found!')
        }
    }),
    requireValidPasswordForUser:check('password')
    .trim()
    .custom( async (password,{req})=>{
        const user = await usersRepo.getOneBy({email:req.body.email})
        if(!user){
            throw new Error('Invalid Email')
        }
        const validPassword = await usersRepo.comparePassword(
            user.password,
            password
        )
        if(!validPassword){
            throw new Error('Invalid Password')
        }
    }),
    requireTittle:check('tittle')
    .trim()
    .isLength({min:5,max:40})
    .withMessage("Must be between 5 and 40 characters")
    ,
    requirePrice:check('price')
    .trim()
    .toFloat()
    .isFloat({min:1})
    .withMessage("Must be a number greater than 1")    
}