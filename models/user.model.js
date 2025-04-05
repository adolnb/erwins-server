import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    lastname1: { type: String, required: true, trim: true },
    lastname2: { type: String, required: false, trim: true },
    password: { type: String, required: true },
    type: { type: String, required: true, enum: ['ADMINISTRADOR', 'EMPLEADO', 'PROVEEDOR'] }
});


export default mongoose.model('users', userSchema);