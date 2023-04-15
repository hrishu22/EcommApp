const express= require('express')
const productsRepo = require('../repository/products')
const router  = express.Router()
const productIndexTemplate= require('../views/products/index')
router.get('/', async (req,res)=>{
    const products = await productsRepo.getAll();
    res.send(productIndexTemplate({products}))
})
module.exports = router;