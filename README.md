![Screenshot 1](https://i.imgur.com/DRg9JM8.png) ![Screenshot 2](https://i.imgur.com/pn2DLRn.png)

# Weather Dashboard

## Description
***
The Weather Dashboard is a web application that provides users with real-time weather information. The application fetches weather data from various APIs and displays it in an intuitive and user-friendly interface. Users can view current weather conditions, time, and flag images based on their location. The application is built with modern web technologies and is designed to be responsive and performant.
***

## Front End
***
- React
- TypeScript
- CSS (optional: TailwindCSS)
***

## Back End
***
- Node.js
- Express
- TypeScript
***

## API's
***
- [OpenWeatherAPI](https://openweathermap.org/api)
- [TimeAPI](https://timeapi.io/swagger/index.html)
- [FlagsAPI](https://flagsapi.com/)
***

## Getting Started

First, run the Front-End server:

* In a new terminal, navigate to the frontend folder.
```bash
npm start
```

Second, run the Back-End server:

* In a new terminal, navigate to the backend folder.

```bash
# Create dist folder
mkdir dist

# Compile TypeScript files
npx tsc

# Take the newly created "index.js" file created in backend/src and move it to the "dist" folder we created in the backend root folder.

# Run the server
node dist/index.js
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying weather-dashboard/src/components/Weather.tsx. The page auto-updates as you edit the file.
