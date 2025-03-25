const cartDb = require("../models/cart.js");

const addProduct = async (req, res) => {
 
  try {
    const { productId, quantity, price } = req.body;
    const userId=req.user.id
    console.log("product id",productId)
    console.log("quantity",quantity)
    const cartId = await cartDb.findOne({ where: { userId, productId } });
    
    if (!cartId) {
      await cartDb.create({ productId, userId, quantity, price });
    } else {
      if (quantity > 0) {
        await cartDb.update(
          { quantity: quantity },
          { where: { userId, productId } }
        );
      } else {
        await cartId.destroy();
      }
    }
    
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: "cant add product in card" });
  }
};
const deleteProduct = async (req, res) => {

  try {
    const productId = req.params.id;
    const userId=req.user.id
    console.log(productId)
    const product = await cartDb.findOne({where:{productId,userId}});
    if (product) {
      await product.destroy();
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "cant delete product in card" });
  }
};
const allProducts = async (req, res) => {
  try {
    console.log(33)
    const userId = req.user.id;
    
    const products = await cartDb.findAll({ where: { userId: userId } });
    console.log(products);
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ error: "cant fetch cart products" });
  }
};
const getSingleProduct=async(req,res)=>{
  try{
  const {productId}=req.query;
  const userId=req.user.id

  const cartitem=await cartDb.findOne({where:{productId,userId}});
  if(!cartitem){
    return res.json({quantity:0})
  }
  res.json({quantity:cartitem.quantity});
}
catch(err){
  res.sendStatus(500);
}

}
module.exports = { deleteProduct, addProduct, allProducts,getSingleProduct };
