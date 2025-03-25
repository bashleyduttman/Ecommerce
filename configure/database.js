const {Sequelize}=require("sequelize");
const sequelize=new Sequelize('ecom','root','deepak@12345',
    {
        host:"localhost",
        dialect:'mysql',
        logging:false,
    
    }
)
async function connectionCheck() {
    try{
        await sequelize.authenticate();
        console.log("connection successfull");
    }
    catch(err){
        console.log("not connected");
    }

    

}
connectionCheck()
module.exports=sequelize;