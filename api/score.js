const mongoose = require('mongoose');

// Definición del Esquema (Estructura de tus datos)
const ScoreSchema = new mongoose.Schema({
    nombre: String,
    facultad: String,
    puntos: Number,
    fecha: { type: Date, default: Date.now }
});

// Evita errores de re-declaración del modelo en Netlify
const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

exports.handler = async (event, context) => {
    // Forzamos a que la función no espere a que el loop de eventos esté vacío
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        // Conexión a MongoDB usando la variable de entorno de Netlify
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        // CASO 1: GUARDAR PUNTAJE (POST)
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

        // CASO 2: OBTENER EL TOP 5 (GET)
        if (event.httpMethod === 'GET') {
            // Buscamos los 5 mejores puntajes, del más alto al más bajo
            const topScores = await Score.find()
                .sort({ puntos: -1, fecha: 1 })
                .limit(5);
            
            return {
                statusCode: 200,
                body: JSON.stringify(topScores),
                headers: { "Content-Type": "application/json" }
            };
        }

        return { statusCode: 405, body: "Método no permitido" };

    } catch (error) {
        console.error("Error en la función score:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: { "Content-Type": "application/json" }
        };
    }
};