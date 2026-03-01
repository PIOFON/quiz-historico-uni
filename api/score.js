const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    nombre: String,
    facultad: String,
    puntos: Number,
    fecha: { type: Date, default: Date.now }
});

const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

// Vercel usa req (request) y res (response)
module.exports = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI.trim(), {
                serverSelectionTimeoutMS: 5000, 
                family: 4 
            });
        }

        // POST: Guardar puntaje
        if (req.method === 'POST') {
            const newScore = new Score({
                nombre: req.body.nombre,
                facultad: req.body.facultad,
                puntos: req.body.puntos
            });
            await newScore.save();
            return res.status(201).json({ message: "Guardado" });
        }

        // GET: Obtener tabla
        if (req.method === 'GET') {
            const topScores = await Score.find().sort({ puntos: -1, fecha: 1 }).limit(5);
            return res.status(200).json(topScores);
        }

        return res.status(405).json({ message: "Método no permitido" });

    } catch (error) {
        console.error("Error crítico de BD:", error);
        return res.status(500).json({ error: error.message });
    }
};