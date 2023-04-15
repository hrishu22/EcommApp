const express = require('express')
const productsRepo = require('../../repository/products')
const productsEditTemplate = require('../../views/admin/products/Edit')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const {requireTittle, requirePrice} = require('./validators')
const {check,validationResult } = require('express-validator');
const multer = require('multer')
const {handleErrors,requireAuth} = require('./middleware')


const router = express.Router()
const upload = multer({storage:multer.memoryStorage()})



router.get('/admin/products',requireAuth, async (req,res)=>{

    const products = await productsRepo.getAll()
    res.send(productsIndexTemplate({products}))

})

router.get('/admin/products/new',requireAuth,(req,res)=>{
    res.send(productsNewTemplate({req}))
})

router.post('/admin/products/new',
    requireAuth,
    upload.single('image'),
    [
        requireTittle,
        requirePrice],
        handleErrors(productsNewTemplate),
       
        async (req,res)=>{
    
    

    const image = req.file.buffer.toString('base64')
    const {tittle,price} = req.body
    //  console.log(tittle)
    await productsRepo.create({tittle,price,image})

    res.redirect('/admin/products')
}) 

router.get('/admin/products/:id/edit',async (req,res)=>{
   const product = await productsRepo.getOne(req.params.id)
   if(!product){
    return res.send('product not found!!')
   }
   res.send(productsEditTemplate({product}))  
})
router.post('/admin/products/:id/edit',
requireAuth,
upload.single('image'),
[requireTittle,
requirePrice],
handleErrors(productsEditTemplate,async (req)=>{
    const product = await productsRepo.getOne(req.params.id)
    return {product}
})
,async (req,res)=>{
    const changes = req.body
    if(req.file){
        changes.image= req.file.buffer.toString('base64')

    }
    try{
        await productsRepo.update(req.params.id,changes)
    }catch(err){
        return res.send("Could not find item")
    }
    res.redirect('/admin/products')
    
})

router.post('/admin/products/:id/delete',requireAuth, async (req,res)=>{
    await productsRepo.delete(req.params.id)

    res.redirect('/admin/products')
})


module.exports= router