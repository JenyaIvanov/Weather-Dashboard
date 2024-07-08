// Imports
import React, { useState, useEffect, useReducer, ReactNode } from 'react';
import axios from 'axios';
import Modal from './Modal';

// Icon Imports
import { FaWind, FaGear  } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoThermometerOutline, IoPeopleCircleSharp } from "react-icons/io5";
import { BsThermometer, BsThermometerHigh } from "react-icons/bs";
import DefaultLocation from './location/DefaultLocation.jpeg';
import { FaGithub } from "react-icons/fa";
import { GiBlackFlag } from "react-icons/gi";
import { TiWeatherCloudy, TiWeatherPartlySunny, TiWeatherShower, TiWeatherWindy, TiWeatherStormy, TiWeatherDownpour, TiWeatherNight, TiWeatherSunny, TiWeatherSnow, } from "react-icons/ti";
import { IoMdInformationCircleOutline } from "react-icons/io";

// Weather App
const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [timeData, setTimeData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [useCelsius, setUseCelsius] = useState<boolean>(true);
  const [weatherLocation, setWeatherLocation] = useState<string>("Tokyo");
  const [countryFlag, setCountryFlag] = useState<string>("https://flagsapi.com/JP/flat/64.png");
  const [populationCount, setPopulationCount] = useState<string>("0");

  // Timezones
  var cityTimezones = require('city-timezones');

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

    // Country Flag Generator
    function fetchCountryFlag(code:string) {

      
      if(code === undefined) // Default Flag If None Is Found
        code = "AQ"

      // Time Data
      const flags_api_url = 'https://flagsapi.com/';
      const flags_settings = '/shiny/64.png';

      const flag_image = flags_api_url+code+flags_settings;

      setCountryFlag(flag_image);

    };


  function handleSubmit(e:any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    // console.log(e.target[0]?.value);
    // console.log(weatherLocation);

    const location = e.target[0]?.value;
    //console.log('Location Changed To: '+ location);
    setWeatherLocation(location);
    
  }

  // Returns the day NUMBER after tomorrow.
  // EX: Sunday (0) -> Tuesday (2)
  function dayAfterTomorrow(dayName:string){
    if (dayName == "Sunday")
      return 2;
    
    if (dayName == "Monday")
      return 3;

    if (dayName == "Tuesday")
      return 4;

    if (dayName == "Wednesday")
      return 5;
    
    if (dayName == "Thursday")
      return 6;

    if (dayName == "Friday")
      return 0;

    if (dayName == "Saturday")
      return 1;

    return 0;
  }

  function populationShortner() {
    const number = parseInt(populationCount);
    //console.log('[DEBUG] Num: '+ number + '. PC: ' + populationCount);

    // No data passed from num
    if(number == null)
      return "ERR1";

    if(number > 10000000000){
      return String(number).substring(0,2) + '.' + String(number).substring(2,3) + 'B';
    }
    
    if(number > 1000000000){
        return String(number).substring(0,1) + '.' + String(number).substring(1,3) + 'B';
    }

    if(number > 10000000){
      return String(number).substring(0,2) + '.' + String(number).substring(2,3) + 'M';
    }
  
    if(number > 1000000){
        return String(number).substring(0,1) + '.' + String(number).substring(1,3) + 'M';
    }

    if(number > 100000){
      return String(number).substring(0,3) + '.' + String(number).substring(2,3) + 'K';
    }

    if(number > 10000){
      return String(number).substring(0,2) + '.' + String(number).substring(2,3) + 'K';
    }
  
    if(number > 1000){
        return String(number).substring(0,1) + '.' + String(number).substring(1,3) + 'K';
    }

    if(number <= 1000){
      return String(number);
    }

    return "ERR2";
  }





  useEffect(() => {
    const fetchWeatherData = async () => {
      try {        
  
        // Weather Data
        const backend_url = 'http://localhost:5000/weather/'

        let selectedUnits = 'metric'; // Default value.

        if(useCelsius == true)
          selectedUnits = 'metric';
        else
          selectedUnits = 'imperial';
  
        //console.log('[DEBUG] location: ' + weatherLocation + '. units: ' + selectedUnits);

        const weather_response = await axios.get(backend_url, 
          {params: {city: weatherLocation, units: selectedUnits}});
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
            const backend_url = 'http://localhost:5000/forecast/';

            let selectedUnits = 'metric'; // Default value.

            if(useCelsius == true)
              selectedUnits = 'metric';
            else
              selectedUnits = 'imperial';

            const forecast_response = await axios.get(backend_url,{params: {city: weatherLocation, units: selectedUnits}});
            //console.log(forecast_response.data)

            setForecastData(forecast_response.data);
            
            setPopulationCount(forecast_response.data.city.population)

          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        };
  
    // Local Time API Request
    const fetchTimeData = async () => {
      try {

        let timezone = "Europe"; // Default Value
  
        // Time Data
        const timezone_api_url = 'https://timeapi.io/api/Time/current/zone?timeZone=';
        
        // Get Timezone for a city
        const getTimeZone = cityTimezones.lookupViaCity(weatherLocation);
        
        //console.log(getTimeZone);

        if(weatherLocation == "London"){ // Special condition for multiple cities with same name.
          timezone = (getTimeZone[1].timezone).split('/')[0];
          fetchCountryFlag(getTimeZone[1]?.iso2);
        } else {
          timezone = (getTimeZone[0].timezone).split('/')[0];
          fetchCountryFlag(getTimeZone[0]?.iso2);
        }
        //console.log('[DEBUG] Location: ' + weatherLocation + '. Timezone: ' + timezone);
  
        const time_response = await axios.get(timezone_api_url+timezone+'/'+weatherLocation);
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
  , [countryFlag, weatherLocation, useCelsius]);

  

  //  Variables Manipulation
  let AM_PM = "Day"; // Default value
  let background_image = "./img/background/ClearDay.jpeg"; // Default value
  const date = new Date();


  if(timeData?.hour >= 19 || timeData?.hour >= 0 && timeData?.hour < 6){
    AM_PM = "Night";
  }
    
  if(timeData?.hour > 5 && timeData?.hour < 19){
    AM_PM = "Day";
  }

  if(weatherData != null){
    background_image = "./img/background/" + weatherData?.weather[0]?.main + AM_PM + ".jpeg";
  }

  return (

    
    
    <div className='overflow-hidden'>
      {weatherData && (
        <div className='mt-1'>

          <div 
              style={{backgroundImage: 'url('+background_image+')'}}
              className={"font-poppins h-[30rem] rounded-[8%] p-1 bg-cover"}
          >
          
            <div className='flex flex-row mt-4 justify-between ms-[1rem] text-[1.1rem]'>

              <div className='flex items-start'>
                <p className='me-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>{timeData?.day }</p>
                <p className='drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>{months[timeData?.month-1]},</p>
                <p className='font-thin ms-1 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>{timeData?.dayOfWeek}</p>
              </div>

            </div>

            <div className='ms-[4.5rem] mt-[6.5rem] scale-[115%] flex-row text-center font-poppins'>
                <p className='font-normal text-normal mb-[-1.3rem] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]'> {weatherData?.name}</p>
                <p className='font-bold text-[4rem] m-[-1rem] drop-shadow-lg'> {(''+weatherData?.main?.temp).substring(0,2)}°{useCelsius ? "C" : "F"}  </p>
                <p className='font-thin text-sm drop-shadow-lg'> Feels Like {Math.floor(weatherData?.main?.feels_like)}°{useCelsius ? "C" : "F"} </p>
                <p className='font-normal text-[1.3rem] m-[-0.4rem] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]'> {weatherData?.weather[0]?.main}</p>
            </div>

            <div className='m-4 p-1 flex flex-row justify-between text-center mt-[10rem] drop-shadow-md text-sm font-poppins font-thin'>
              <div className='flex gap-1'>
                <BsThermometerHigh className='text-xl'/>
                <p className='drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]'>Max {(''+weatherData?.main?.temp_max).substring(0,2)}°{useCelsius ? "C" : "F"}</p>
              </div>
              <div className='flex gap-1'>
                  <BsThermometer className='text-xl'/>
                  <p className='drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]'>Min {(''+weatherData?.main?.temp_min).substring(0,2)}°{useCelsius ? "C" : "F"}</p>
              </div>
            </div>
          </div>
          


          <div className='flex flex-row mt-[0.5rem] m-1 justify-between drop-shadow-md text-[1.2rem]'> 

          <div className='p-[1.4rem] font-thin rounded-[20%] bg-gradient-to-tl from-blue-400 from-50% to-purple-400'>
              <MdOutlineWaterDrop className='ms-[-0.2rem]' />
              <p> Humidity </p> 
              <p> {weatherData?.main?.humidity}%</p>
            </div>

            <div className='p-[1.4rem] px-[1.7rem] font-thin rounded-[20%] bg-gradient-to-tr from-blue-400 from-50% to-purple-400'>
              <IoThermometerOutline className='ms-[-0.2rem]' />
              <p> Pressure </p> 
              <p> {weatherData?.main?.pressure} hPa</p>
            </div>

            <div className='p-[1.4rem] font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-50% to-purple-400'>
              <FaWind className='ms-[0rem]' />
              <p> Wind </p> 
              <p> {weatherData?.wind?.speed} km/h</p>
            </div>

          </div>

          <div className='
                  p-2 pt-5 pb-5 text-center items-center align-middle mt-2 mb-2
                  font-poppins flex flex-row justify-between drop-shadow-md
                  bg-zinc-700 bg-opacity-30 rounded-3xl'>
            
            <div className='p-1 flex flex-col text-center items-center'>              
              <p className='font-thin text-sm'>NOW</p>
              
              <div className='m-[0.3rem]'>
                {weatherData?.weather[0]?.main === "Clear" && AM_PM === "Day" ? <TiWeatherSunny className='text-5xl' /> : ""}
                {weatherData?.weather[0]?.main === "Clear" && AM_PM === "Night" ? <TiWeatherNight className='text-5xl' /> : ""}

                {weatherData?.weather[0]?.main === "Clouds" && AM_PM === "Day" ? <TiWeatherPartlySunny className='text-5xl' /> : ""}
                {weatherData?.weather[0]?.main === "Clouds" && AM_PM === "Night" ? <TiWeatherCloudy className='text-5xl' /> : ""}

                {weatherData?.weather[0]?.main === "Rain" ? <TiWeatherDownpour className='text-5xl' /> : ""}

                {weatherData?.weather[0]?.main === "Drizzle" ? <TiWeatherShower className='text-5xl' /> : ""}

                {weatherData?.weather[0]?.main === "Thunderstorm" ? <TiWeatherStormy className='text-5xl' /> : ""}

                {weatherData?.weather[0]?.id >= 700 &&  weatherData?.weather[0]?.id <= 799? <TiWeatherWindy className='text-5xl' /> : ""}

                {weatherData?.weather[0]?.main === "Snow" ? <TiWeatherSnow className='text-5xl' /> : ""}

              </div>

              <p>{(''+weatherData?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1 flex flex-col text-center items-center'>              
              <p className='font-thin text-sm'>{forecastData?.list[1]?.dt_txt?.substring(10,16)}</p>
              <div className='m-[0.3rem]'>
                {forecastData?.list[1]?.weather[0]?.main === "Clear" && AM_PM === "Day" ? <TiWeatherSunny className='text-5xl' /> : ""}
                {forecastData?.list[1]?.weather[0]?.main === "Clear" && AM_PM === "Night" ? <TiWeatherNight className='text-5xl' /> : ""}

                {forecastData?.list[1]?.weather[0]?.main === "Clouds" && AM_PM === "Day" ? <TiWeatherPartlySunny className='text-5xl' /> : ""}
                {forecastData?.list[1]?.weather[0]?.main === "Clouds" && AM_PM === "Night" ? <TiWeatherCloudy className='text-5xl' /> : ""}

                {forecastData?.list[1]?.weather[0]?.main === "Rain" ? <TiWeatherDownpour className='text-5xl' /> : ""}

                {forecastData?.list[1]?.weather[0]?.main === "Drizzle" ? <TiWeatherShower className='text-5xl' /> : ""}

                {forecastData?.list[1]?.weather[0]?.main === "Thunderstorm" ? <TiWeatherStormy className='text-5xl' /> : ""}

                {forecastData?.list[1]?.weather[0]?.id >= 700 &&  weatherData?.weather[0]?.id <= 799? <TiWeatherWindy className='text-5xl' /> : ""}

                {forecastData?.list[1]?.weather[0]?.main === "Snow" ? <TiWeatherSnow className='text-5xl' /> : ""}

              </div>
              <p>{('' + forecastData?.list[1]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1 flex flex-col text-center items-center'>             
              <p className='font-thin text-sm'>{forecastData?.list[2]?.dt_txt?.substring(10,16)}</p>
              <div className='m-[0.3rem]'>
                {forecastData?.list[2]?.weather[0]?.main === "Clear" && AM_PM === "Day" ? <TiWeatherSunny className='text-5xl' /> : ""}
                {forecastData?.list[2]?.weather[0]?.main === "Clear" && AM_PM === "Night" ? <TiWeatherNight className='text-5xl' /> : ""}

                {forecastData?.list[2]?.weather[0]?.main === "Clouds" && AM_PM === "Day" ? <TiWeatherPartlySunny className='text-5xl' /> : ""}
                {forecastData?.list[2]?.weather[0]?.main === "Clouds" && AM_PM === "Night" ? <TiWeatherCloudy className='text-5xl' /> : ""}

                {forecastData?.list[2]?.weather[0]?.main === "Rain" ? <TiWeatherDownpour className='text-5xl' /> : ""}

                {forecastData?.list[2]?.weather[0]?.main === "Drizzle" ? <TiWeatherShower className='text-5xl' /> : ""}

                {forecastData?.list[2]?.weather[0]?.main === "Thunderstorm" ? <TiWeatherStormy className='text-5xl' /> : ""}

                {forecastData?.list[2]?.weather[0]?.id >= 700 &&  weatherData?.weather[0]?.id <= 799? <TiWeatherWindy className='text-5xl' /> : ""}

                {forecastData?.list[2]?.weather[0]?.main === "Snow" ? <TiWeatherSnow className='text-5xl' /> : ""}

              </div>
              <p>{('' + forecastData?.list[2]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1 flex flex-col text-center items-center'>
              <p className='font-thin text-sm'>Tomorrow</p>
              <div className='m-[0.3rem]'>
                {forecastData?.list[7]?.weather[0]?.main === "Clear" ? <TiWeatherSunny className='text-5xl' /> : ""}

                {forecastData?.list[7]?.weather[0]?.main === "Clouds" ? <TiWeatherPartlySunny className='text-5xl' /> : ""}
                
                {forecastData?.list[7]?.weather[0]?.main === "Rain" ? <TiWeatherDownpour className='text-5xl' /> : ""}

                {forecastData?.list[7]?.weather[0]?.main === "Drizzle" ? <TiWeatherShower className='text-5xl' /> : ""}

                {forecastData?.list[7]?.weather[0]?.main === "Thunderstorm" ? <TiWeatherStormy className='text-5xl' /> : ""}

                {forecastData?.list[7]?.weather[0]?.id >= 700 &&  weatherData?.weather[0]?.id <= 799? <TiWeatherWindy className='text-5xl' /> : ""}

                {forecastData?.list[7]?.weather[0]?.main === "Snow" ? <TiWeatherSnow className='text-5xl' /> : ""}

              </div>
              <p>{('' + forecastData?.list[7]?.main?.temp).substring(0,2)}°</p>
            </div>

            <div className='p-1 flex flex-col text-center items-center'>              
              <p className='font-thin text-sm'>{days[dayAfterTomorrow(timeData?.dayOfWeek)]}</p>
              <div className='m-[0.3rem]'>
                {forecastData?.list[14]?.weather[0]?.main === "Clear" ? <TiWeatherSunny className='text-5xl' /> : ""}

                {forecastData?.list[14]?.weather[0]?.main === "Clouds" ? <TiWeatherPartlySunny className='text-5xl' /> : ""}
                
                {forecastData?.list[14]?.weather[0]?.main === "Rain" ? <TiWeatherDownpour className='text-5xl' /> : ""}

                {forecastData?.list[14]?.weather[0]?.main === "Drizzle" ? <TiWeatherShower className='text-5xl' /> : ""}

                {forecastData?.list[14]?.weather[0]?.main === "Thunderstorm" ? <TiWeatherStormy className='text-5xl' /> : ""}

                {forecastData?.list[14]?.weather[0]?.id >= 700 &&  weatherData?.weather[0]?.id <= 799? <TiWeatherWindy className='text-5xl' /> : ""}

                {forecastData?.list[14]?.weather[0]?.main === "Snow" ? <TiWeatherSnow className='text-5xl' /> : ""}

              </div>
              <p>{('' + forecastData?.list[14]?.main?.temp).substring(0,2)}°</p>
            </div>
            

          </div>
            <footer className=' rounded-lg shadow dark:bg-zinc-800 p-1 align-middle flex flex-row justify-between'>
              
              <button onClick={() => setSettingsOpen(true)}>
                <div className='m-1 flex flex-row gap-[0.4rem] hover:text-yellow-100'>
                  <FaGear className='text-xl mt-[0.15rem]'/>
                  <p className='font-thin'>Settings</p>
                </div>
              </button>

              <div className={settingsOpen ? "visible" : "invisible"}>
                <Modal settingsOpen={settingsOpen} onClose={() => setSettingsOpen(false)}>
                    <div 
                      style={{backgroundImage: 'url('+DefaultLocation+')'}}
                      className={"mt-[2rem] scale-[115%] h-[20rem] rounded-[5%] p-1 align-middle items-center text-center bg-cover relative"}
                    >
                      <div className='flex flex-col mt-[6.5rem]'>
                        <h3 className='drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] font-bold text-4xl'>{weatherData?.name}</h3>
                      </div>

                      <div className='absolute bottom-0 ms-3 mb-2 h-40 w-60 rounded-xl p-2 bg-gradient-to-r from-cyan-400 from-50% to-purple-300'>
                          
                            <div className='font-poppins font-thin text-xs mt-2'>
                              
                              <div className='flex flex-row gap-2 mb-2'>
                                <BsThermometer className='text-xl'/>
                                <p className='mt-[0.1rem]'>{(''+weatherData?.main?.temp).substring(0,2)}°{useCelsius ? "C" : "F"}</p>
                              </div>
                             
                              <div className='flex flex-row gap-2 mb-2'>
                                <TiWeatherCloudy className='text-xl'/>
                                <p className='mt-[0.1rem]'>{weatherData?.weather[0]?.main}</p>
                              </div>
                              
                              <div className='flex flex-row gap-2 mb-2'>
                                <IoMdInformationCircleOutline className='text-xl'/>
                                <p className='mt-[0.1rem]'>{weatherData?.weather[0]?.description}</p>
                              </div>

                              <div className='flex flex-row gap-2 mb-2'>
                                <GiBlackFlag className='text-xl'/>
                                <img src={countryFlag} className=" scale-[110%]  object-contain drop-shadow-md" width={64/3} alt={"Country Flag"} />
                              </div>

                              <div className='flex flex-row mb-1'>
                               <IoPeopleCircleSharp className='text-xl me-1'/>
                               <p className='mt-[0.1rem]'>Population: {populationShortner()}</p>
                              </div>

                            </div>
                        
                      </div>
                  </div>


                  <div className='mt-9 font-poppins font-thin text-sm'>
                    <p>Change location</p>
                    <form onSubmit={handleSubmit}>
                      <input name="location" className="shadow mt-1 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Location" type="text" placeholder="Enter City Name" />
                    </form>
                    <div className='mt-3'>
                      <p>Degrees unit</p>
                      <div className="flex items-center">

                        {useCelsius == false ? <input id="default-radio-1" readOnly checked type="radio" onClick={() => setUseCelsius(false)} name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> : ""}
                        {useCelsius == true ? <input id="default-radio-1" readOnly type="radio" onClick={() => setUseCelsius(false)} name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> : ""}

                        <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Fahrenheit</label>
                      </div>
                      <div className="flex items-center">
                        {useCelsius == false ? <input id="default-radio-2" readOnly onClick={() => setUseCelsius(true)} type="radio" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> : ""}
                        {useCelsius == true ? <input id="default-radio-2" checked readOnly onClick={() => setUseCelsius(true)} type="radio" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> : ""}
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
