const user=require('./models/user');
const products=require('./models/products')
const cart=require('./models/cart')
const db=require('./configure/database')

async function syncDb() {
    try{
        await db.sync({alter:true});
        console.log("table created")
    }
    catch(err){
        console.log("not created")
    }

}
syncDb()