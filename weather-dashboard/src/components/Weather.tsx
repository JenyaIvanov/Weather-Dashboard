// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

// Icon Imports
import { FaWind, FaGear  } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoThermometerOutline } from "react-icons/io5";
import { BsThermometer, BsThermometerHigh } from "react-icons/bs";
import CloudyIcon from './icon/CloudyIcon.png';
import DefaultLocation from './location/DefaultLocation.jpeg';
import { FaGithub } from "react-icons/fa";

// Weather App
const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [timeData, setTimeData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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

    
    
    <div>
      {weatherData && (
        <div className='mt-2'>

          <div 
              style={{backgroundImage: 'url('+background_image+')'}}
              className={"font-poppins h-[28rem] rounded-[8%] p-3 bg-cover"}
          >
          
            <div className='flex flex-row justify-between mt-4 m-1 drop-shadow-md text-[1.1rem]'>

              <div className='flex items-start'>
                <p className='me-2'>{timeData?.day }</p>
                <p className=''>{months[timeData?.month-1]},</p>
                <p className='font-thin ms-1'>{timeData?.dayOfWeek}</p>
              </div>

            </div>

            <div className='ms-[4.5rem] mt-[4.3rem] flex-row text-center drop-shadow-md font-poppins'>
                <p className='font-normal text-normal'> {weatherData?.name}</p>
                <p className='font-bold text-[4rem] m-[-1rem]'> {(''+weatherData?.main?.temp).substring(0,2)}°C  </p>
                <p className='font-thin text-normal'> Feels Like {Math.floor(weatherData?.main?.feels_like)}°C </p>
                <p className='font-normal text-[1.3rem] m-[-0.4rem]'> {weatherData?.weather[0]?.main}</p>
            </div>

            <div className='m-4 p-1 flex flex-row justify-between text-center mt-[9.5rem] drop-shadow-md text-sm font-poppins font-thin'>
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
          


          <div className='flex flex-row p-1 mt-2 m-1 justify-between drop-shadow-md text-[1.2rem]'> 

          <div className='p-[1.5rem] font-thin rounded-[20%] bg-gradient-to-tl from-blue-400 from-50% to-purple-400'>
              <MdOutlineWaterDrop className='ms-[-0.2rem]' />
              <p> Humidity </p> 
              <p> {weatherData?.main?.humidity}%</p>
            </div>

            <div className='p-[1.5rem] font-thin rounded-[20%] bg-gradient-to-tr from-blue-400 from-50% to-purple-400'>
              <IoThermometerOutline className='ms-[-0.2rem]' />
              <p> Pressure </p> 
              <p> {weatherData?.main?.pressure} MB</p>
            </div>

            <div className='p-[1.5rem] font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-50% to-purple-400'>
              <FaWind className='ms-[0rem]' />
              <p> Wind </p> 
              <p> {weatherData?.wind?.speed} km/h</p>
            </div>

          </div>

          <div className='
                  p-2 pt-6 pb-6 text-center items-center align-middle mt-2 mb-3
                  font-poppins flex flex-row justify-between drop-shadow-md
                  bg-zinc-700 bg-opacity-30 rounded-3xl'>
            
          <div className='p-1'>              
              <p className='font-thin text-sm'>NOW</p>
              <img src={CloudyIcon} className="scale-75" width={55} alt={"Cloudy Weather"} />
              <p>{(''+weatherData?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1'>              
              <p className='font-thin text-sm'>{forecastData?.list[1]?.dt_txt?.substring(10,16)}</p>
              <img src={CloudyIcon} className="scale-75" width={55} alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[1]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1'>              
              <p className='font-thin text-sm'>{forecastData?.list[2]?.dt_txt?.substring(10,16)}</p>
              <img src={CloudyIcon} className="scale-75" width={55} alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[2]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1'>
              <p className='font-thin text-sm'>Tomorrow</p>
              <img src={CloudyIcon} className="scale-75 ms-1" width={55} alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[8]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1'>              
              <p className='font-thin text-sm'>{days[timeData?.day+2]}</p>
              <img src={CloudyIcon} className="scale-75" width={55} alt={"Cloudy Weather"} />
              <p>{('' + forecastData?.list[17]?.main?.temp).substring(0,2)}°</p>
            </div>
            

          </div>
            <footer className='mt-5 rounded-lg shadow dark:bg-zinc-800 p-1 pt-3 pb-3 align-middle flex flex-row justify-between'>
              
              <button onClick={() => setSettingsOpen(true)}>
                <div className='m-1 flex flex-row gap-[0.4rem] hover:text-yellow-100'>
                  <FaGear className='text-xl mt-[0.15rem]'/>
                  <p className='font-thin'>Settings</p>
                </div>
              </button>

              <div className={settingsOpen ? "visible" : "invisible"}>
                <Modal settingsOpen={settingsOpen} onClose={() => setSettingsOpen(false)}>
                  
                  <div className='flex flex-row justify-between mt-5 bg-gradient-to-r from-teal-900 from-40% to-cyan-700 scale-[123%] rounded-md p-2'>
                    <div className='font-poppins font-thin text-xs'>
                      <h3>LOCATION NAME</h3>
                      <p>DEGREES</p>
                      <p>WEATHER DESCRIPTION</p>
                    </div>
                    <img src={DefaultLocation} className="scale-100 rounded-md drop-shadow-md" width={85} alt={"Cloudy Weather"} />
                  </div>


                  <div className='mt-7 font-poppins font-thin text-sm'>
                    <p>Change location</p>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Enter City Name" />

                    <div className='mt-3'>
                      <p>Degrees unit</p>
                      <div className="flex items-center">
                        <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Fahrenheit</label>
                      </div>
                      <div className="flex items-center">
                        <input checked id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Celsius</label>
                      </div>
                    </div>
                    
                  </div>
                </Modal>
              </div>
              

              <div className='flex flex-row mt-4 m-[0.6rem]'>
                <p className='text-sm font-thin me-1'>Created by </p>
                <a href="https://www.linkedin.com/in/jenya-ivanov-a8a82a200/" className='text-sm font-thin me-1 hover:cursor-pointer text-yellow-400'>Jenya Ivanov</a>
                <p className='text-sm font-thin'>2024®</p>
                <a href="https://github.com/JenyaIvanov" className='hover:cursor-pointer hover:text-teal-400'>
                  <FaGithub className='text-3xl ms-2 mt-[-0.4rem]' />
                </a>
              </div>

            </footer>


        </div>
      )}
    </div>


  );
};

export default Weather;
