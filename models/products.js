const { DataTypes } = require('sequelize')
const db=require('../configure/database.js')

const products=db.define("products",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type:DataTypes.STRING
    },
    quantity:{
        type:DataTypes.STRING
    },
    price:{
        type:DataTypes.INTEGER
    }
    ,
    description:{
        type:DataTypes.STRING
    },
    image:{
        type:DataTypes.STRING
    },
    category:{
        type:DataTypes.STRING
    }

})
module.exports=products;
