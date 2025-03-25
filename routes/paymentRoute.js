require("dotenv").config();
const express=require('express')
const cors=require('cors');
const bodyParser=require('body-parser')
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const app=express()
app.use(cors())
app.use(bodyParser.json())
app.post("/create-paytment-intent",async(req,res)=>{
    try{
        const {amount,curreny}=req.body;
        const paymentIntent=await stripe.paymentIntent.create({
            amout:amount*100,
            curreny:curreny||"inr",
        })
        res.send({
            clientSecreat:paymentIntent.client_secreat
        })
    }
    catch(err){
        res.json({err:err.message})
    }
})