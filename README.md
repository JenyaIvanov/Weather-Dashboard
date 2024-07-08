#### Mobile Preview ![Screenshot 1](https://i.imgur.com/5cIbave.png) Mobile - Settings Menu![Screenshot 2](https://i.imgur.com/F7JSiDp.png)

# Weather Dashboard

## Description
***
The Weather Dashboard is a modern web application designed to provide users with accurate and up-to-date weather information. By leveraging powerful APIs, the application presents current weather conditions, local time, and flag images based on user location. The front-end is built with React and TypeScript, ensuring a seamless and dynamic user experience. The back-end, powered by Node.js and Express, efficiently handles data fetching and processing. This project demonstrates the integration of various technologies to deliver a comprehensive weather application.
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
