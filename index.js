const express = require('express');
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./Routes/admin/auth')
const adminProductsRouter = require('./Routes/admin/product')
const productsRouter = require('./Routes/product')
const cartsRouter = require('./Routes/cart')

const app = express();

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true})) // middleware function that itself parse the data coming from req object 

app.use(cookieSession({
    keys:['qwertyuiop']  //encryption key...
}))

app.use(authRouter)
app.use(adminProductsRouter)
app.use(productsRouter)
app.use(cartsRouter)
app.use
app.listen(3000,()=>{
    console.log("listening.....")
})
  