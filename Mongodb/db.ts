import mongoose from "mongoose"

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}
@linkedin-clone1.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`

if (!connectionString){
    throw new Error("Connection string is not valid!!!");
}

const connectDB = async () => {
    if(mongoose.connection?.readyState >= 1){
        
    }

    try {
        console.log("--Attempting to conntect to DB--")
        await mongoose.connect(connectionString);
        
    } catch (error) {
        console.log("Error connection toward the DB!!!" , error);
    }
}

export default connectDB ;