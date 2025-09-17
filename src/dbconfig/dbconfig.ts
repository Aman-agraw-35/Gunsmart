import mongoose from "mongoose";

export async function connect(){
try{
    if (!process.env.MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    await mongoose.connect(process.env.MONGODB_URI)
    const connection = mongoose.connection;

    connection.on('connected',() => {
        console.log('MongoDb connected successfully');
        
    })

    connection.on('error',(err) => {
        console.log("connection error "+ err);
        process.exit();
    })

} catch (error){
    console.log("something went wrong !");
    console.log(error);

    
}

}
    
