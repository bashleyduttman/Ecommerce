const express=require("express")
const router=express.Router()
const { Op } = require("sequelize");
const products = require("../models/products");
const multer=require('multer');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
})
const uploads=multer({storage});

//ADMIN ROUTES
router.post('/uploadproducts',uploads.single("image"),async (req,res)=>{
    try{
    const {name,quantity,price,description,category}=req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null; 
    await products.create({name,quantity,price,description,image,category});
    res.status(201).json({message:"product added"})

    }
    catch(error){
        res.status(500).json({error:"cant add products"})
    }
})

router.put('/updateproduct/:id',async(req,res)=>{
    try{
        const fetchProduct=await products.findByPk(req.params.id);
        if(!fetchProduct)return res.status(404).json({error:"product not found"});
        const {name,quantity,price,description}=req.body;
        const image=req.file?req.file.fieldname:null;
        await fetchProduct.update({name,quantity,price,description,image});
        res.status(201).json({message:"product updated succesfully"});
    }
    catch(err){
        res.status(500).json({errot:"internal error"})
    }
})

router.delete('/deleteproduct/:id',async(req,res)=>{
    try{
        const fetchProduct=await products.findByPk(req.params.id);
        if(!fetchProduct)return res.status(404).json({error:"product not found"});
        await fetchProduct.destroy();
        res.status(201).json({message:"product deleted successfully"});

    }
    catch(err){
        res.status(500).json({error:"internal error"});
    }
})

router.get("/item/:id",async(req,res)=>{
    try{
    const item=await products.findByPk(req.params.id);
    console.log(req.params.id)
    if(!item)return res.status(404).json({error:"can find product"});
    res.json(item);
    }
catch(err){
    res.sendStatus(500)
}
})
//USER ROUTES


router.get('/allproducts', async (req, res) => {
    try {
        const { search, limit, minprice, maxprice, category, page = 1, ascending, descending } = req.query;
        
        console.log("Page:", page);
        let whereCondition = {};

        // Search filtering
        if (search) {
            whereCondition = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search.trim()}%` } }, 
                    { category: { [Op.like]: `%${search.trim()}%` } } 
                ]
            };
        }

        // Price filtering
        if (minprice || maxprice) {
            whereCondition.price = {}; 

            if (minprice) whereCondition.price[Op.gte] = parseFloat(minprice);
            if (maxprice) whereCondition.price[Op.lte] = parseFloat(maxprice);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Sorting logic
        let order = [];
        if (ascending === 'true') {
            order.push(['price', 'ASC']); // Sort by price in ascending order
        } else if (descending === 'true') {
            order.push(['price', 'DESC']); // Sort by price in descending order
        }

        console.log("Filters Applied:", whereCondition);
        console.log("Sorting Order:", order);

        const allProducts = await products.findAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: offset,
            order: order, // Apply sorting
        });

        // Checking if there are more products in the next page
        const nextOffset = parseInt(page) * parseInt(limit);
        const hasNext = await products.findAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: nextOffset,
        });

        console.log("Products Found:", allProducts.length); 

        res.json({ allProducts: allProducts, hasNext: hasNext.length > 0 });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.sendStatus(500);
    }
});

module.exports=router