// Ejemplo de backend Node.js para consultar Google Places
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyA8ZZDA0KffVr3n7XV0uLA9-p6r_qMfkFc';

// Servir archivos estáticos desde /public
app.use(express.static('public'));

// Permitir CORS solo desde tu dominio principal
app.use(cors({
  origin: 'https://familytaxinyc.com',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Endpoint para autocompletar lugares
app.get('/api/places-autocomplete', async (req, res) => {
  const { input, sessionToken } = req.query;
  if (!input) return res.status(400).json({ error: 'Falta parámetro input' });

  const url = 'https://places.googleapis.com/v1/places:autocomplete';
  const body = {
    input,
    languageCode: 'es',
    sessionToken: sessionToken || undefined
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error consultando Google Places v1', details: err.message });
  }
});

// Endpoint para detalles de un lugar
app.get('/api/place-details', async (req, res) => {
  const { place_id, sessionToken } = req.query;
  if (!place_id) return res.status(400).json({ error: 'Falta parámetro place_id' });

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(place_id)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'formattedAddress,location',
        ...(sessionToken ? { 'X-Goog-Session-Token': sessionToken } : {})
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error consultando detalles v1', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
