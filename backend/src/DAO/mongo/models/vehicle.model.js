import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        unique: [true, "Ya hay un vehiculo con ese Dominio"],
        required: [true, "El Dominio es obligatorio"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clients",
        required: [true, "La Identificación es obligatoria"],
    },
    year: {
        type: String,
        match: [/^\d+$/, "El año solo debe contener números"],
    },
    brand: {
        type: String,
        required: [true, "La marca es obligatoria"],
    },
    model: {
        type: String,
        required: [true, "El modelo es obligatorio"],
    },
    color: String,
});

export default mongoose.model("vehicles", vehicleSchema);
