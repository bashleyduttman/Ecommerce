const { DataTypes } = require('sequelize')
const db=require('../configure/database.js')

const cart=db.define("cart",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    userId:{
        type:DataTypes.INTEGER
    },
    productId:{
        type:DataTypes.INTEGER,
    },
    quantity:{
        type:DataTypes.INTEGER
    },
    price:{
        type:DataTypes.INTEGER
    }
    
    

})
module.exports=cart;
