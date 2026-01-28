const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Middleware de vérification
const verifyESP32 = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("Accès refusé");
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.device = verified;
        next();
    } catch (err) {
        res.status(400).send("Jeton invalide");
    }
};

app.post('/api/data', verifyESP32, (req, res) => {
    console.log("Données reçues de l'ESP32:", req.body);
    res.status(200).send("Données stockées");
});