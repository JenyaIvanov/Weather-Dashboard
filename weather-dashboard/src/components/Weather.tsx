// Imports
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

// Icon Imports
import { FaWind, FaGear } from "react-icons/fa6";
import { MdOutlineWaterDrop, MdOutlineVisibility } from "react-icons/md";
import { IoThermometerOutline, IoPeopleCircleSharp } from "react-icons/io5";
import { BsThermometer, BsThermometerHigh } from "react-icons/bs";
import DefaultLocation from "./location/DefaultLocation.jpeg";
import { FaGithub } from "react-icons/fa";
import { GiBlackFlag } from "react-icons/gi";
import {
  TiWeatherCloudy,
  TiWeatherPartlySunny,
  TiWeatherShower,
  TiWeatherWindy,
  TiWeatherStormy,
  TiWeatherDownpour,
  TiWeatherNight,
  TiWeatherSunny,
  TiWeatherSnow,
} from "react-icons/ti";
import { IoMdInformationCircleOutline } from "react-icons/io";

// Weather App
const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [timeData, setTimeData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [useCelsius, setUseCelsius] = useState<boolean>(true);
  const [weatherLocation, setWeatherLocation] = useState<string>("Tokyo");
  const [countryFlag, setCountryFlag] = useState<string>(
    "https://flagsapi.com/JP/flat/64.png"
  );
  const [populationCount, setPopulationCount] = useState<string>("0");

  // Timezones
  var cityTimezones = require("city-timezones");

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
    "Saturday",
  ];

  // Country Flag Generator
  function fetchCountryFlag(code: string) {
    if (code === undefined)
      // Default Flag If None Is Found
      code = "AQ";

    // Time Data
    const flags_api_url = "https://flagsapi.com/";
    const flags_settings = "/shiny/64.png";

    const flag_image = flags_api_url + code + flags_settings;

    setCountryFlag(flag_image);
  }

  function handleSubmit(e: any) {
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
  function dayAfter(dayName: string, delta: number) {
    if (dayName === "Sunday") return (2 + delta) % 7;

    if (dayName === "Monday") return (3 + delta) % 7;

    if (dayName === "Tuesday") return (4 + delta) % 7;

    if (dayName === "Wednesday") return (5 + delta) % 7;

    if (dayName === "Thursday") return (6 + delta) % 7;

    if (dayName === "Friday") return (0 + delta) % 7;

    if (dayName === "Saturday") return (1 + delta) % 7;

    return 0;
  }

  function populationShortner() {
    const number = parseInt(populationCount);
    //console.log('[DEBUG] Num: '+ number + '. PC: ' + populationCount);

    // No data passed from num
    if (number == null) return "ERR1";

    if (number > 10000000000) {
      return (
        String(number).substring(0, 2) +
        "." +
        String(number).substring(2, 3) +
        "B"
      );
    }

    if (number > 1000000000) {
      return (
        String(number).substring(0, 1) +
        "." +
        String(number).substring(1, 3) +
        "B"
      );
    }

    if (number > 10000000) {
      return (
        String(number).substring(0, 2) +
        "." +
        String(number).substring(2, 3) +
        "M"
      );
    }

    if (number > 1000000) {
      return (
        String(number).substring(0, 1) +
        "." +
        String(number).substring(1, 3) +
        "M"
      );
    }

    if (number > 100000) {
      return (
        String(number).substring(0, 3) +
        "." +
        String(number).substring(2, 3) +
        "K"
      );
    }

    if (number > 10000) {
      return (
        String(number).substring(0, 2) +
        "." +
        String(number).substring(2, 3) +
        "K"
      );
    }

    if (number > 1000) {
      return (
        String(number).substring(0, 1) +
        "." +
        String(number).substring(1, 3) +
        "K"
      );
    }

    if (number <= 1000) {
      return String(number);
    }

    return "ERR2";
  }

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Weather Data
        const backend_url = "http://localhost:5000/weather/";

        let selectedUnits = "metric"; // Default value.

        if (useCelsius === true) selectedUnits = "metric";
        else selectedUnits = "imperial";

        //console.log('[DEBUG] location: ' + weatherLocation + '. units: ' + selectedUnits);

        const weather_response = await axios.get(backend_url, {
          params: { city: weatherLocation, units: selectedUnits },
        });
        setWeatherData(weather_response.data);

        //console.log(weather_response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    // Weather Forcast API Request
    const fetchForecastData = async () => {
      try {
        // Weather Data
        const backend_url = "http://localhost:5000/forecast/";

        let selectedUnits = "metric"; // Default value.

        if (useCelsius === true) selectedUnits = "metric";
        else selectedUnits = "imperial";

        const forecast_response = await axios.get(backend_url, {
          params: { city: weatherLocation, units: selectedUnits },
        });
        //console.log(forecast_response.data);

        setForecastData(forecast_response.data);

        setPopulationCount(forecast_response.data.city.population);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    // Local Time API Request
    const fetchTimeData = async () => {
      try {
        let timezone = "Europe"; // Default Value

        // Time Data
        const timezone_api_url =
          "https://timeapi.io/api/Time/current/zone?timeZone=";

        // Get Timezone for a city
        const getTimeZone = cityTimezones.lookupViaCity(weatherLocation);

        //console.log(getTimeZone);

        if (weatherLocation === "London") {
          // Special condition for multiple cities with same name.
          timezone = getTimeZone[1].timezone.split("/")[0];
          fetchCountryFlag(getTimeZone[1]?.iso2);
        } else {
          timezone = getTimeZone[0].timezone.split("/")[0];
          fetchCountryFlag(getTimeZone[0]?.iso2);
        }
        //console.log('[DEBUG] Location: ' + weatherLocation + '. Timezone: ' + timezone);

        const time_response = await axios.get(
          timezone_api_url + timezone + "/" + weatherLocation
        );
        setTimeData(time_response.data);

        //console.log(time_response)
      } catch (error) {
        console.error("Error fetching time data:", error);
      }
    };

    // Function Calls
    fetchForecastData();
    fetchWeatherData();
    fetchTimeData();
  }, [countryFlag, weatherLocation, useCelsius, cityTimezones]);

  //  Variables Manipulation
  let AM_PM = "Day"; // Default value
  let background_image = "./img/background/ClearDay.jpeg"; // Default value

  if (timeData?.hour >= 19 || (timeData?.hour >= 0 && timeData?.hour < 6)) {
    AM_PM = "Night";
  }

  if (timeData?.hour > 5 && timeData?.hour < 19) {
    AM_PM = "Day";
  }

  if (weatherData != null) {
    background_image =
      "./img/background/" + weatherData?.weather[0]?.main + AM_PM + ".jpeg";
  }

  return (
    <div className="2xl:mx-[40vh] 2xl:bg-cyan-600 2xl:bg-opacity-[10%] lg:mx-[10vh] md:mx-[5vh] md:bg-opacity-[0%] sm:mx-[20vh] sm:rounded-md sm:drop-shadow-md">
      {weatherData && (
        <div className="2xl:mx-[19vh] xl:mx-[18vh] xl:scale-[100%] xl:my-[5vh] lg:mx-[8vh] md:scale-[80%] md:my-[-5vh] md:mx-[10vh] sm:mx-[30vh] sm:my-[4vh] ">
          {/* Hero Section */}
          {/* Dynamic Background */}
          <div
            style={{ backgroundImage: "url(" + background_image + ")" }}
            className={
              "font-poppins h-[30rem] rounded-[8%] p-1 bg-cover xl:mx-[20vh] lg:mx-[25vh] md:mb-[2.5vh] sm:mx-[25vh] sm:scale-[105%] sm:mb-[2vh]"
            }
          >
            {/* Date */}
            <div className="flex flex-row mt-4 justify-between ms-[1rem] md:text-[1.2rem] sm:text-[1.3rem] text-[1.1rem]">
              <div className="flex items-start">
                <p className="me-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {timeData?.day}
                </p>
                <p className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {months[timeData?.month - 1]},
                </p>
                <p className="font-thin ms-1 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {timeData?.dayOfWeek}
                </p>
              </div>
            </div>

            {/* Middle Section - Main Temperature */}
            <div className="ms-[4.5rem] mt-[6.5rem] xl:scale-[125%] md:scale-[115%] sm:scale-[130%] scale-[115%] flex-row text-center font-poppins">
              <p className="font-normal text-normal mb-[-1.3rem] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]">
                {weatherData?.name}
              </p>
              <p className="font-bold text-[4rem] m-[-1rem] drop-shadow-lg">
                {("" + weatherData?.main?.temp).substring(0, 2)}°
                {useCelsius ? "C" : "F"}{" "}
              </p>
              <p className="font-thin text-sm drop-shadow-lg">
                Feels Like {Math.floor(weatherData?.main?.feels_like)}°
                {useCelsius ? "C" : "F"}{" "}
              </p>
              <p className="font-normal text-[1.3rem] m-[-0.4rem] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]">
                {weatherData?.weather[0]?.main}
              </p>
            </div>

            {/* Bottom Section - Max & Min */}
            <div
              className="m-4 p-1 flex drop-shadow-md flex-row text-sm 
              font-poppins font-thin justify-between text-center mt-[10rem]
              xl:scale-[110%] xl:my-[15vh] xl:mx-[5vh]
              lg:scale-[110%] lg:my-[19vh] lg:mx-[8vh]
              md:scale-[107%] md:my-[19vh] md:mx-[5vh] 
              sm:mx-[6vh] sm:my-[16vh] sm:scale-[110%]"
            >
              <div className="flex gap-1">
                <BsThermometerHigh className="text-xl" />
                <p className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]">
                  Max {("" + weatherData?.main?.temp_max).substring(0, 2)}°
                  {useCelsius ? "C" : "F"}
                </p>
              </div>
              <div className="flex gap-1">
                <BsThermometer className="text-xl" />
                <p className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]">
                  Min {("" + weatherData?.main?.temp_min).substring(0, 2)}°
                  {useCelsius ? "C" : "F"}
                </p>
              </div>
            </div>
          </div>
          {/* End of Hero Section */}
          {/* Middle Section */}
          <div>
            {/* More Weather Information */}
            <div className="sm:mx-[15vh] md:mx-[7vh] flex flex-row mt-[0.5rem] m-1 justify-between drop-shadow-md text-[1.2rem]">
              <div className="p-[1.4rem] font-thin rounded-[20%] bg-gradient-to-tl from-blue-400 from-50% to-purple-400">
                <MdOutlineWaterDrop className="ms-[-0.2rem]" />
                <p> Humidity </p>
                <p> {weatherData?.main?.humidity}%</p>
              </div>

              <div className="p-[1.4rem] px-[1.7rem] font-thin rounded-[20%] bg-gradient-to-tr from-blue-400 from-50% to-purple-400">
                <IoThermometerOutline className="ms-[-0.2rem]" />
                <p> Pressure </p>
                <p> {weatherData?.main?.pressure} hPa</p>
              </div>

              <div className="p-[1.4rem] font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-50% to-purple-400">
                <FaWind className="ms-[0rem]" />
                <p> Wind </p>
                <p> {weatherData?.wind?.speed} km/h</p>
              </div>

              <div className="hidden sm:inline p-[1.4rem] font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-50% to-purple-400">
                <MdOutlineVisibility className="ms-[0rem]" />
                <p> Visibility </p>
                <p> {weatherData?.visibility} m</p>
              </div>

              <div className="hidden sm:inline p-[1.4rem] font-thin rounded-[20%] bg-gradient-to-b from-blue-400 from-50% to-purple-400">
                <TiWeatherCloudy className="ms-[0rem] text-[1.3rem]" />
                <p> Cloudiness </p>
                <p> {weatherData?.clouds?.all}%</p>
              </div>
            </div>

            {/* Forecast Information */}
            <div
              className="
                p-2 pt-5 pb-5 text-center items-center align-middle my-2
                font-poppins flex flex-row justify-between drop-shadow-md
                bg-zinc-700 bg-opacity-30 rounded-3xl 
                2xl:mx-[3vh] 2xl:px-[1.5vh] 2xl:my-[1vh] 2xl:py-[1.5vh]
                xl:mx-[2vh] xl:px-[2vh] xl:my-[1vh] xl:py-[1.5vh]
                sm:py-[2vh] sm:px-[1vh] sm:mx-[8vh] sm:my-[1vh]"
            >
              <div className="p-1 flex flex-col text-center items-center">
                <p className="font-thin text-sm">NOW</p>

                <div className="m-[0.3rem]">
                  {weatherData?.weather[0]?.main === "Clear" &&
                  AM_PM === "Day" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}
                  {weatherData?.weather[0]?.main === "Clear" &&
                  AM_PM === "Night" ? (
                    <TiWeatherNight className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {weatherData?.weather[0]?.main === "Clouds" &&
                  AM_PM === "Day" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}
                  {weatherData?.weather[0]?.main === "Clouds" &&
                  AM_PM === "Night" ? (
                    <TiWeatherCloudy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {weatherData?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {weatherData?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {weatherData?.weather[0]?.main === "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {weatherData?.weather[0]?.id >= 700 &&
                  weatherData?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {weatherData?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>

                <p>{("" + weatherData?.main?.temp).substring(0, 2)}°</p>
              </div>

              <div className="p-1 flex flex-col text-center items-center">
                <p className="font-thin text-sm">
                  {forecastData?.list[1]?.dt_txt?.substring(10, 16)}
                </p>

                <div className="m-[0.3rem]">
                  {forecastData?.list[1]?.weather[0]?.main === "Clear" &&
                  AM_PM === "Day" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}
                  {forecastData?.list[1]?.weather[0]?.main === "Clear" &&
                  AM_PM === "Night" ? (
                    <TiWeatherNight className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[1]?.weather[0]?.main === "Clouds" &&
                  AM_PM === "Day" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}
                  {forecastData?.list[1]?.weather[0]?.main === "Clouds" &&
                  AM_PM === "Night" ? (
                    <TiWeatherCloudy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[1]?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[1]?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[1]?.weather[0]?.main ===
                  "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[1]?.weather[0]?.id >= 700 &&
                  forecastData?.list[1]?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[1]?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>
                <p>
                  {("" + forecastData?.list[1]?.main?.temp).substring(0, 2)}°
                </p>
              </div>

              <div className="p-1 flex flex-col text-center items-center">
                <p className="font-thin text-sm">
                  {forecastData?.list[2]?.dt_txt?.substring(10, 16)}
                </p>

                <div className="m-[0.3rem]">
                  {forecastData?.list[2]?.weather[0]?.main === "Clear" &&
                  AM_PM === "Day" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}
                  {forecastData?.list[2]?.weather[0]?.main === "Clear" &&
                  AM_PM === "Night" ? (
                    <TiWeatherNight className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[2]?.weather[0]?.main === "Clouds" &&
                  AM_PM === "Day" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}
                  {forecastData?.list[2]?.weather[0]?.main === "Clouds" &&
                  AM_PM === "Night" ? (
                    <TiWeatherCloudy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[2]?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[2]?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[2]?.weather[0]?.main ===
                  "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[2]?.weather[0]?.id >= 700 &&
                  forecastData?.list[2]?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[2]?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>
                <p>
                  {("" + forecastData?.list[2]?.main?.temp).substring(0, 2)}°
                </p>
              </div>

              <div className="p-1 flex flex-col text-center items-center">
                <p className="font-thin text-sm">Tomorrow</p>

                <div className="m-[0.3rem]">
                  {forecastData?.list[7]?.weather[0]?.main === "Clear" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[7]?.weather[0]?.main === "Clouds" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[7]?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[7]?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[7]?.weather[0]?.main ===
                  "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[7]?.weather[0]?.id >= 700 &&
                  forecastData?.list[7]?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[7]?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>
                <p>
                  {("" + forecastData?.list[7]?.main?.temp).substring(0, 2)}°
                </p>
              </div>

              <div className="p-1 flex flex-col text-center items-center">
                <p className="font-thin text-sm">
                  {days[dayAfter(timeData?.dayOfWeek, 0)]}
                </p>
                <div className="m-[0.3rem]">
                  {forecastData?.list[14]?.weather[0]?.main === "Clear" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[14]?.weather[0]?.main === "Clouds" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[14]?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[14]?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[14]?.weather[0]?.main ===
                  "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[14]?.weather[0]?.id >= 700 &&
                  forecastData?.list[14]?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[14]?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>
                <p>
                  {("" + forecastData?.list[14]?.main?.temp).substring(0, 2)}°
                </p>
              </div>

              <div className="hidden sm:flex p-1 flex-col text-center items-center">
                <p className="font-thin text-sm">
                  {days[dayAfter(timeData?.dayOfWeek, 1)]}
                </p>
                <div className="m-[0.3rem]">
                  {forecastData?.list[22]?.weather[0]?.main === "Clear" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[22]?.weather[0]?.main === "Clouds" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[22]?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[22]?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[22]?.weather[0]?.main ===
                  "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[22]?.weather[0]?.id >= 700 &&
                  forecastData?.list[22]?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[22]?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>
                <p>
                  {("" + forecastData?.list[22]?.main?.temp).substring(0, 2)}°
                </p>
              </div>

              <div className="hidden sm:flex p-1 flex-col text-center items-center">
                <p className="font-thin text-sm">
                  {days[dayAfter(timeData?.dayOfWeek, 2)]}
                </p>
                <div className="m-[0.3rem]">
                  {forecastData?.list[30]?.weather[0]?.main === "Clear" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[30]?.weather[0]?.main === "Clouds" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[30]?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[30]?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[30]?.weather[0]?.main ===
                  "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[30]?.weather[0]?.id >= 700 &&
                  forecastData?.list[30]?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[30]?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>
                <p>
                  {("" + forecastData?.list[30]?.main?.temp).substring(0, 2)}°
                </p>
              </div>

              <div className="hidden sm:flex p-1 flex-col text-center items-center">
                <p className="font-thin text-sm">
                  {days[dayAfter(timeData?.dayOfWeek, 3)]}
                </p>
                <div className="m-[0.3rem]">
                  {forecastData?.list[38]?.weather[0]?.main === "Clear" ? (
                    <TiWeatherSunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[38]?.weather[0]?.main === "Clouds" ? (
                    <TiWeatherPartlySunny className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[38]?.weather[0]?.main === "Rain" ? (
                    <TiWeatherDownpour className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[38]?.weather[0]?.main === "Drizzle" ? (
                    <TiWeatherShower className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[38]?.weather[0]?.main ===
                  "Thunderstorm" ? (
                    <TiWeatherStormy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[38]?.weather[0]?.id >= 700 &&
                  forecastData?.list[38]?.weather[0]?.id <= 799 ? (
                    <TiWeatherWindy className="text-5xl" />
                  ) : (
                    ""
                  )}

                  {forecastData?.list[38]?.weather[0]?.main === "Snow" ? (
                    <TiWeatherSnow className="text-5xl" />
                  ) : (
                    ""
                  )}
                </div>
                <p>
                  {("" + forecastData?.list[38]?.main?.temp).substring(0, 2)}°
                </p>
              </div>
            </div>
          </div>
          {/* Bottom Section */}
          <footer className=" rounded-lg shadow bg-zinc-700 bg-opacity-50 p-1 align-middle flex flex-row justify-between">
            <button onClick={() => setSettingsOpen(true)}>
              <div className="m-1 flex flex-row gap-[0.4rem] hover:text-yellow-100">
                <FaGear className="text-xl mt-[0.15rem] sm:ms-[1vh]" />
                <p className="font-thin">Settings</p>
              </div>
            </button>

            {/* Settings Menu */}
            <div className={settingsOpen ? "visible" : "invisible"}>
              <Modal
                settingsOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
              >
                {/* Top Section - Location Details */}
                <div
                  style={{ backgroundImage: "url(" + DefaultLocation + ")" }}
                  className={
                    "mt-[2rem] scale-[115%] h-[20rem] rounded-[5%] p-1 align-middle items-center text-center bg-cover relative"
                  }
                >
                  {/* Location - Name*/}
                  <div className="flex flex-col mt-[6.5rem]">
                    <h3 className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] font-bold text-4xl">
                      {weatherData?.name}
                    </h3>
                  </div>

                  {/* Location - Bottom Section*/}
                  <div className="absolute bottom-0 ms-3 mb-2 h-40 w-60 rounded-xl p-2 bg-gradient-to-r from-cyan-400 from-50% to-purple-300">
                    <div className="font-poppins font-thin text-xs mt-2">
                      {/* Location - Temperature*/}
                      <div className="flex flex-row gap-2 mb-2">
                        <BsThermometer className="text-xl" />
                        <p className="mt-[0.1rem]">
                          {("" + weatherData?.main?.temp).substring(0, 2)}°
                          {useCelsius ? "C" : "F"}
                        </p>
                      </div>

                      {/* Location - Weather*/}
                      <div className="flex flex-row gap-2 mb-2">
                        <TiWeatherCloudy className="text-xl" />
                        <p className="mt-[0.1rem]">
                          {weatherData?.weather[0]?.main}
                        </p>
                      </div>

                      {/* Location - Weather Description*/}
                      <div className="flex flex-row gap-2 mb-2">
                        <IoMdInformationCircleOutline className="text-xl" />
                        <p className="mt-[0.1rem]">
                          {weatherData?.weather[0]?.description}
                        </p>
                      </div>

                      {/* Location - Flag*/}
                      <div className="flex flex-row gap-2 mb-2">
                        <GiBlackFlag className="text-xl" />
                        <img
                          src={countryFlag}
                          className=" scale-[110%]  object-contain drop-shadow-md"
                          width={64 / 3}
                          alt={"Country Flag"}
                        />
                      </div>

                      {/* Location - Population*/}
                      <div className="flex flex-row mb-1">
                        <IoPeopleCircleSharp className="text-xl me-1" />
                        <p className="mt-[0.1rem]">
                          Population: {populationShortner()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section (Settings)*/}
                <div className="mt-9 font-poppins font-thin text-sm">
                  <p>Change location</p>
                  {/* Settings - Location Changer*/}
                  <form onSubmit={handleSubmit}>
                    <input
                      name="location"
                      className="shadow mt-1 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="Location"
                      type="text"
                      placeholder="Enter City Name"
                    />
                  </form>

                  {/* Settings - Units Changer*/}
                  <div className="mt-3">
                    <p>Degrees unit</p>

                    {/* Settings - Units - Fahrenheit Selector*/}
                    <div className="flex items-center">
                      {useCelsius === false ? (
                        <input
                          id="default-radio-1"
                          readOnly
                          checked
                          type="radio"
                          onClick={() => setUseCelsius(false)}
                          name="default-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      ) : (
                        ""
                      )}
                      {useCelsius === true ? (
                        <input
                          id="default-radio-1"
                          readOnly
                          type="radio"
                          onClick={() => setUseCelsius(false)}
                          name="default-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      ) : (
                        ""
                      )}

                      <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Fahrenheit
                      </label>
                    </div>

                    {/* Settings - Units - Celsius Selector*/}
                    <div className="flex items-center">
                      {useCelsius === false ? (
                        <input
                          id="default-radio-2"
                          readOnly
                          onClick={() => setUseCelsius(true)}
                          type="radio"
                          name="default-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      ) : (
                        ""
                      )}
                      {useCelsius === true ? (
                        <input
                          id="default-radio-2"
                          checked
                          readOnly
                          onClick={() => setUseCelsius(true)}
                          type="radio"
                          name="default-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      ) : (
                        ""
                      )}
                      <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Celsius
                      </label>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>

            {/* Footer - Credits*/}
            <div className="flex flex-row mt-4 m-[0.6rem]">
              <p className="text-sm font-thin me-1">Created by </p>
              <a
                href="https://www.linkedin.com/in/jenya-ivanov-a8a82a200/"
                className="text-sm font-thin me-1 hover:cursor-pointer text-yellow-400"
              >
                Jenya Ivanov
              </a>
              <p className="text-sm font-thin">2024®</p>
              <a
                href="https://github.com/JenyaIvanov"
                className="hover:cursor-pointer hover:text-teal-400"
              >
                <FaGithub className="text-3xl ms-2 mt-[-0.4rem]" />
              </a>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Weather;
