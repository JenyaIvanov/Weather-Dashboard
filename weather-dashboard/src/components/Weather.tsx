// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    
    // Functions

    // Weather API Request
    const fetchData = async () => {
      try {        
        const response = await axios.get('http://localhost:5000/weather/');
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Function Calls
    fetchData();
  }, []);

  return (

    // Weather Dashboard HTML

    <div>
      <h1>Weather Dashboard</h1>
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          
        </div>
      )}
    </div>


  );
};

export default Weather;
