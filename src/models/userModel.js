import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    idProduct: [String],
    Quantity: [Number],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;

