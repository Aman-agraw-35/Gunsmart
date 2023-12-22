import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: "SampleUser",
    id : [integer] ,
    Quantity : [integer]

});


const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User; 

