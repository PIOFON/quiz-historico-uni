const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    nombre: String,
    facultad: String,
    puntos: Number,
    fecha: { type: Date, default: Date.now }
});

const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

exports.handler = async (event, context) => {
    // Esto evita que la función se quede colgada esperando
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (mongoose.connection.readyState !== 1) {
            // El .trim() quita espacios, y el family: 4 obliga a usar IPv4 (soluciona el ENOTFOUND)
            await mongoose.connect(process.env.MONGO_URI.trim(), {
                serverSelectionTimeoutMS: 5000, 
                family: 4 
            });
        }

        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body);
            const newScore = new Score({
                nombre: data.nombre,
                facultad: data.facultad,
                puntos: data.puntos
            });
            await newScore.save();
            return { statusCode: 201, body: JSON.stringify({ message: "Guardado" }) };
        }

        if (event.httpMethod === 'GET') {
            const topScores = await Score.find().sort({ puntos: -1, fecha: 1 }).limit(5);
            return { statusCode: 200, body: JSON.stringify(topScores) };
        }

        return { statusCode: 405, body: "Método no permitido" };

    } catch (error) {
        console.error("Error crítico de BD:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};