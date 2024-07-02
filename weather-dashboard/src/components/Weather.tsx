// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Icon Imports
import { FaWind, FaGear  } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoThermometerOutline } from "react-icons/io5";
import { BsThermometer, BsThermometerHigh } from "react-icons/bs";
import CloudyIcon from './icon/CloudyIcon.png';

// Weather App
const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [timeData, setTimeData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);

  // Help Variables
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  useEffect(() => {
    
    // Functions

    // Weather API Request
    const fetchWeatherData = async () => {
      try {        

        // Weather Data
        const weather_response = await axios.get('http://localhost:5000/weather/');
        setWeatherData(weather_response.data);

        //console.log(weather_response.data)

      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

        // Weather Forcast API Request
        const fetchForecastData = async () => {
          try {        
    
            // Weather Data
            const forecast_response = await axios.get('http://localhost:5000/forecast/');
            setForecastData(forecast_response.data);
    
            //console.log(forecast_response.data)

          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        };

    // Local Time API Request
    const fetchTimeData = async () => {
      try {

        // Time Data
        const time_response = await axios.get('https://timeapi.io/api/Time/current/zone?timeZone=Europe/London');
        setTimeData(time_response.data);

        //console.log(time_response)

      } catch (error) {
        console.error('Error fetching time data:', error);
      }
    };

    // Function Calls
    fetchForecastData();
    fetchWeatherData();
    fetchTimeData();
  }
  , []);

  //  Variables Manipulation
  let AM_PM = "Day"; // Default value
  let background_image = "./img/background/ClearDay.jpeg"; // Default value


  if(timeData?.hour > 19 && timeData?.hour < 6){
    AM_PM = "Night";
  }
    
  if(timeData?.hour > 5 && timeData?.hour < 20){
    AM_PM = "Day";
  }

  if(weatherData != null){
    background_image = "./img/background/" + weatherData?.weather[0]?.main + AM_PM + ".jpeg";
  }

  return (

    // Weather Dashboard HTML

    <div>
      {weatherData && (
        <div className=''>
          
          <div 
              style={{backgroundImage: 'url('+background_image+')'}}
              className={"font-poppins h-[28rem] rounded-[10%] p-3 bg-cover"}
          >
            
            <p>DEBUG Background: {weatherData?.weather[0]?.main}</p>
            <div className='flex flex-row justify-between m-2 drop-shadow-md'>

              <div className='flex items-start'>
                <p className='me-2'>{timeData?.day }</p>
                <p className=''>{months[timeData?.month-1]},</p>
                <p className='font-thin ms-1'>{timeData?.dayOfWeek}</p>
              </div>

              <div className='flex flex-row gap-2 hover:text-yellow-100'>
                  <FaGear className='text-xl'/>
                  <p className='font-thin'>Settings</p>
              </div>
            </div>

            <div className='ms-12 mt-[3rem] flex-row text-center drop-shadow-md'>
                <p className='font-poppins font-thin text-sm'> {weatherData?.name}</p>
                <p className='font-poppins font-bold text-6xl'> {(''+weatherData?.main?.temp).substring(0,2)}°C  </p>
                <p className='font-poppins font-thin text-sm'> Feels Like {Math.floor(weatherData?.main?.feels_like)}°C </p>
                <p> {weatherData?.weather[0]?.main}</p>
            </div>

            <div className='m-5 p-1 flex flex-row justify-between text-center mt-[10rem] drop-shadow-md text-sm font-poppins font-thin'>
              <div className='flex gap-1'>
                <BsThermometerHigh className='text-xl'/>
                <p>Max {(''+weatherData?.main?.temp_max).substring(0,2)}°C</p>
              </div>
              <div className='flex gap-1'>
                  <BsThermometer className='text-xl'/>
                  <p>Min {(''+weatherData?.main?.temp_min).substring(0,2)}°C</p>
              </div>
            </div>
          </div>
          


          <div className='flex flex-row p-1 justify-between m-1 drop-shadow-md'> 

            <div className='p-7 font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-60% to-purple-400'>
              <MdOutlineWaterDrop className='ms-[-0.2rem]' />
              <p> Humidity </p> 
              <p> {weatherData?.main?.humidity}%</p>
            </div>

            <div className='p-7 font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-60% to-purple-400'>
              <IoThermometerOutline className='ms-[-0.2rem]' />
              <p> Pressure </p> 
              <p> {weatherData?.main?.pressure} MB</p>
            </div>

            <div className='p-7 font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-60% to-purple-400'>
              <FaWind className='ms-[-0.1rem]' />
              <p> Wind </p> 
              <p> {weatherData?.wind?.speed} km/h</p>
            </div>

          </div>

          <div>
            
            <div>
              <p>NOW</p>
              <img src={CloudyIcon} className="flex size-[3rem] h-full" alt={"Cloudy Weather"} />
              <p>{weatherData?.main?.temp}°</p>
            </div>

            <div>
              <p>{forecastData?.list[1]?.dt_txt?.substring(10,16)}</p>
              <img src={CloudyIcon} className="flex size-[3rem] h-full" alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[1]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div>
              <p>{forecastData?.list[2]?.dt_txt?.substring(10,16)}</p>
              <img src={CloudyIcon} className="flex size-[3rem] h-full" alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[2]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div>
              <p>Tommorow</p>
              <img src={CloudyIcon} className="flex size-[3rem] h-full" alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[8]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div>
              <p>{days[timeData?.day+2]}</p>
              <img src={CloudyIcon} className="flex size-[3rem] h-full" alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[8]?.main?.temp).substring(0,2)}°</p>
            </div>
            

          </div>

        </div>
      )}
    </div>


  );
};

export default Weather;
