import React from "react";
import logo from "./logo.png";
import "./App.css";
import axios from "axios";

const OPEN_WEATHER_API_KEY = "a4e757cb6818e7eb80897ce3362589e3";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: "",
      currCity: "",
      weather: "",
      weatherDescription: "",
      country: "",
      currTemp: 0,
      forecastWeather: [],
      date: new Date(),
    };
  }

  handleChange = (e) => {
    this.setState({
      city: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${this.state.city}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
      )
      .then((response) => response.data[0])
      .then((cityGeoData) =>
        Promise.all([
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
          ),
          axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
          ),
        ])
      )
      .then((response) => {
        const [weatherData, forecastData] = response;
        console.log(weatherData);
        this.setState({
          weather: weatherData.data.weather[0].main,
          weatherDescription: weatherData.data.weather[0].description,
          currCity: weatherData.data.name,
          currTemp: weatherData.data.main.temp,
          forecastWeather: forecastData.data.list,
        });
      });
  };

  render() {
    const weatherInfo = this.state.currCity ? (
      <div>
        <p>Country: {this.state.currCity}</p>

        <p>Current Temperature: {this.state.currTemp.toFixed(1)}°C</p>

        <p>
          Current Weather: {this.state.weather}, {this.state.weatherDescription}
        </p>
      </div>
    ) : (
      <p>Please enter a city name in the input box</p>
    );

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
            />
            <input type="submit" name="submit" value="submit" />
          </form>

          <div>{weatherInfo}</div>
        </header>
      </div>
    );
  }
}

export default App;
