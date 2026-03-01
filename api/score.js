const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    nombre: String,
    facultad: String,
    puntos: Number,
    fecha: { type: Date, default: Date.now }
});

const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (mongoose.connection.readyState !== 1) {
            // El .trim() destruye espacios o saltos de línea invisibles en tu variable
            await mongoose.connect(process.env.MONGO_URI.trim());
        }

        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body);
            const newScore = new Score({
                nombre: data.nombre,
                facultad: data.facultad,
                puntos: data.puntos
            });
            await newScore.save();
            return {
                statusCode: 201,
                body: JSON.stringify({ message: "Puntaje guardado con éxito" }),
                headers: { "Content-Type": "application/json" }
            };
        }

        if (event.httpMethod === 'GET') {
            const topScores = await Score.find().sort({ puntos: -1, fecha: 1 }).limit(5);
            return {
                statusCode: 200,
                body: JSON.stringify(topScores),
                headers: { "Content-Type": "application/json" }
            };
        }

        return { statusCode: 405, body: "Método no permitido" };

    } catch (error) {
        console.error("Error en score.js:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: { "Content-Type": "application/json" }
        };
    }
};