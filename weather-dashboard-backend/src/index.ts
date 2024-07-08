// Imports
import express, { Request, Response } from 'express';
require('dotenv').config()
import axios from 'axios';

// Constants
const app = express();
const PORT = process.env.PORT || 5000;


// Routes

//-- Weather
app.get('/weather', async (req: Request, res: Response) => {
  const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your actual weather API key
  const city = req.query.city || 'Tokyo'; // Default city is London
  const units = req.query.units || 'metric'; // Default units are metric
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`; // Change to your API URL.

  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('[E] Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }

});

app.get('/forecast', async (req: Request, res: Response) => {
  const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your actual weather API key
  const city = req.query.city || 'London'; // Default city is London
  const units = req.query.units || 'metric'; // Default units are metric
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`; // Change to your API URL.

  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('[E] Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
