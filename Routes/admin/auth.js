const express = require('express');
const usersRepo = require('../../repository/users')
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate=require('../../views/admin/auth/signin')
const {check,validationResult } = require('express-validator');
const cookieSession = require('cookie-session');
const {requireValidPasswordForUser, requireEmail,requirePassword,requirePasswordConfirmation,requireEmailExist} = require('./validators')
const {handleErrors} = require('./middleware')
const router = express.Router()


router.get('/signup',(req,res)=>{
    res.send(signupTemplate({req}));
})
// middleware function:-
// const bodyParser=(req,res,next)=>{
//     if(req.method=='POST'){
//     req.on('data',data=>{  // means that run a callback function when an event occurs
//         // console.log(data.toString('utf8')); //data is a buffer or chunk of data in bit format , we hav to convert it into string so that we can read it. 
//         const parsed = data.toString('utf8').split('&')
//         // console.log(parsed)
//         const formData={};
//         for(let pair of parsed){
//             const [key,value] = pair.split('=');
//             formData[key]=value;
//         }
//         // console.log(formData);
//         req.body = formData;
//         next();
//         })
//     }else{
//         next();
//     }
// }


router.post('/signup', [
    requireEmail,
    requirePassword],
    handleErrors(signupTemplate),
async (req,res)=>{
   

    const {email,password} = req.body;
    
    const user = await usersRepo.create({email,password});
    
    //req.session // added by cookie session ... cookie-session is a middleware
    req.session.userId= user.id;  // req.session is an object we can add any property like id

    res.redirect('/admin/products')
})

router.get('/signout',(req,res)=>{
    req.session=null;
    res.send("Logged out!!!!") 

})
router.get('/signin',(req,res)=>{
    res.send(signinTemplate({req}))
})
router.post('/signin',[
    requireEmailExist, requireValidPasswordForUser
], handleErrors(signinTemplate),
 async (req,res)=>{
   
    const {email} = req.body;
    const user  = await usersRepo.getOneBy({email});    

    req.session.userId = user.id;
    res.redirect('/admin/products')
}) 

module.exports = router