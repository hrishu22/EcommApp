const express = require('express')
const cartsRepo = require('../repository/cart')
const productsRepo = require('../repository/products')
const cartShowTemplate = require('../views/carts/show')
const router = express.Router()


// Receive a post request to add an item to a cart

router.post('/cart/products',async (req,res)=>{
    //figure out the cart
    
    let cart
    if(!req.session.cartId){
        // we don't have the cart wee need to create and store it
        cart = await cartsRepo.create({items:[]})
        req.session.cartId = cart.id;
    }else{
        // we have a cart
        cart = await cartsRepo.getOne(req.session.cartId)

    }
    
    const existingItem = cart.items.find(item=> item.id === req.body.productId)
    if(existingItem){
        existingItem.quantity++;
    }else{
        cart.items.push({id:req.body.productId, quantity:1})
    }

    await cartsRepo.update(cart.id,{
        items:cart.items
    })

    res.redirect('/cart')

})

// Receive a get request to show all items in cart
router.get('/cart', async (req,res)=>{
    if(!req.session.cartId){
        return res.redirect('/')
    }
    const cart = await cartsRepo.getOne(req.session.cartId)
    for(let item of cart.items){
        const product = await productsRepo.getOne(item.id)
        item.product = product
    }
    res.send(cartShowTemplate({items:cart.items}))
})


// Receive a post request to delete an item from a cart

router.post('/cart/products/delete', async (req,res)=>{
    
    const {itemId} = req.body
    const cart = await cartsRepo.getOne(req.session.cartId)
    // console.log(cart.items[0].id)
    // console.log(itemId)
    const items = cart.items.filter(it =>{
        return it.id!==itemId
    })
    // console.log(items)
    await cartsRepo.update( req.session.cartId, {items})
    res.redirect('/cart')
})


module.exports = router