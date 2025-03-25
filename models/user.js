const { DataTypes } = require('sequelize')
const db=require('../configure/database.js')
const userTb=db.define('users',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type:DataTypes.STRING,
    },
    password:{
        type:DataTypes.STRING
    }
    ,
    email:{
        type:DataTypes.STRING,
        unique:true,
    }
})
module.exports=userTb

