// Cite: https://www.youtube.com/watch?v=GuA0_Z1llYU
//other than the youtube vedio above, I used google search when I had questions
import React, { useState, useEffect } from 'react';

const api = {
  key: "27dca37aa4607b1dafe3460cad82277f",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch(`${api.base}weather?q=${query}&units=${isCelsius ? 'metric' : 'imperial'}&APPID=${api.key}`);
      const result = await res.json();
      setWeather(result);
    };

    const fetchForecast = async () => {
      const res = await fetch(`${api.base}forecast?q=${query}&units=${isCelsius ? 'metric' : 'imperial'}&APPID=${api.key}`);
      const result = await res.json();
      setForecast(result.list.filter(item => item.dt_txt.includes('12:00:00')));
    };

    if (query) {
      fetchWeather();
      fetchForecast();
    }
  }, [query, isCelsius]);

  const dateBuilder = (d) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  };

  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };
// toggleUnit is a function that toggles the unit between celsius and fahrenheit
  // return the JSX elements to render
  return (
    <div className={(typeof weather.main != "undefined") ? (((weather.main.temp > 16 && isCelsius) || (weather.main.temp > 60 && !isCelsius)) ? 'App sunny' : 'App') : 'App'}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDown={e => e.key === 'Enter' && setQuery(e.target.value)}
          />
        </div>
        <div className="unit-switch">
          <button onClick={() => setIsCelsius(true)}>°C</button>
          <button onClick={() => setIsCelsius(false)}>°F</button>
        </div>
        {(typeof weather.main !== 'undefined') && (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                <div className="temp">{Math.round(weather.main.temp)}{isCelsius ? '°C' : '°F'}</div>
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        )}
        {(forecast.length > 0) && (
          <div className={isCelsius ? 'forecast' : 'forecast fahrenheit'}>
            {forecast.map(item => (
              <div key={item.dt} className="forecast-item">
                <div className="date">{dateBuilder(new Date(item.dt_txt))}</div>
                <div className="weather">{item.weather[0].main}</div>
                <div className="temp">
                  <span className="temp-celsius">{Math.round(item.main.temp)}°C</span>  
                  <span className="temp-fahrenheit">{Math.round((item.main.temp * 9/5) + 32)}°F</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
  
}

export default App;
