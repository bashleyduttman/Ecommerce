const express=require('express');
const router=express.Router();
const {addProduct,deleteProduct,allProducts,getSingleProduct}=require('../controller/cartController');
router.post('/add',addProduct);
router.delete('/delete/:id',deleteProduct);
router.get('/allproducts',allProducts)
router.get('/product',getSingleProduct)

module.exports=router;