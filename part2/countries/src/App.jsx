import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const App = () => {
  const BASEURL = "https://studies.cs.helsinki.fi/restcountries/";
  const [countries, setCountries] = useState([]);
  const [inputText, setInputText] = useState("");
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const fetchWeather = (capital) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
    axios
      .get(url)
      .then((response) => setWeather(response.data))
      .catch((error) => console.error("Weather fetch failed:", error));
  };

  useEffect(() => {
    if (country) {
      fetchWeather(country.capital[0]);
    }
  }, [country]);

  const handleTextChange = (e) => setInputText(e.target.value);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(inputText.toLowerCase()),
  );

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCountry(filteredCountries[0]);
    }
  }, [filteredCountries]);

  const countryDetails = (country) => {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital : {country.capital[0]}</p>
        <p>area : {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} width={300} />
        {weather && (
          <div>
            <h2>Weather in {country.capital[0]}</h2>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Feels like: {weather.main.feels_like}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind speed: {weather.wind.speed} m/s</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        )}
      </div>
    );
  };

  const renderCountries = () => {
    if (filteredCountries.length > 10)
      return <p>Too many matches, specify another filter</p>;
    else if (filteredCountries.length === 1) {
      return countryDetails(filteredCountries[0]);
    }

    return filteredCountries.map((country) => (
      <div key={country.cca3}>
        <p>{country.name.common}</p>
        <button
          onClick={() => {
            setCountry(country);
          }}
        >
          show
        </button>
      </div>
    ));
  };
  useEffect(() => {
    axios
      .get(`${BASEURL}/api/all`)
      .then((response) => setCountries(response.data));
  }, []);

  return (
    <div>
      <span>find countries</span>
      <input type="text" onChange={handleTextChange} value={inputText} />
      {renderCountries()}
      {country && filteredCountries.length !== 1 && countryDetails(country)}
    </div>
  );
};

export default App;
