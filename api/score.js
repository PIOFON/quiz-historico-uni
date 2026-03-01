require('dotenv').config();
const mongoose = require('mongoose');

// Definir el esquema (igual al que teníamos)
const ScoreSchema = new mongoose.Schema({
    nombre: String,
    facultad: String,
    puntos: Number,
    fecha: { type: Date, default: Date.now }
});

const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

exports.handler = async (event, context) => {
    // Conectar a MongoDB
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI);
    }

    if (event.httpMethod === 'POST') {
        const data = JSON.parse(event.body);
        const newScore = new Score(data);
        await newScore.save();
        return { statusCode: 201, body: JSON.stringify({ mjs: "Guardado" }) };
    } 
    
    if (event.httpMethod === 'GET') {
        const top5 = await Score.find().sort({ puntos: -1, fecha: 1 }).limit(5);
        return { statusCode: 200, body: JSON.stringify(top5) };
    }
};