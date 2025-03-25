const express=require('express')
const authRoute=require('./routes/auth.js')
const productRoute=require('./routes/productRoute.js')
const authMiddleWare=require('./middleware/authmiddleware.js');
const cartRoute=require('./routes/cartRoute.js')
const cors=require('cors')
const app=express()
PORT=3500;
app.use(cors())
app.use("/uploads", express.static("uploads"));
app.use(express.json())
app.use('/auth',authRoute)
app.use(authMiddleWare);
app.use('/product',productRoute)
app.use('/cart',cartRoute)
app.listen(PORT)