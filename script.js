// Declarations

const API_KEY = '09d997a8199d3c303a1f76195100c34a'
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Selectors

const currentDay = document.querySelector('.day')
const currentMonth = document.querySelector('.month')
const currentDate = document.querySelector('.date')
const searchInput = document.querySelector('#search-input')
const mainContainer = document.querySelector('.container')
const errorMessage = document.querySelector('.error-section')
const locationName = document.querySelector('.location-name')
const temperature = document.querySelector('.temperature')
const weatherCondition = document.querySelector('.weather-condition')
const humidity = document.querySelector('.humidity-value')
const pressure = document.querySelector('.pressure-value')
const wind = document.querySelector('.wind-value')
const visibility = document.querySelector('.visibility-value')
const sunriseTime = document.querySelector('.sunrise-time')
const sunsetTime = document.querySelector('.sunset-time')

// Functions

const getTimeAndDay = () => {
    const time = new Date()
    const day = time.getDay()
    const date = time.getDate()
    const month = time.getMonth()
    currentMonth.textContent = months[month]
    currentDay.textContent = days[day]
    currentDate.textContent = date

    console.log(time)
}

const fetchCurrentWeather = async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    const response = await fetch(url)
    const data = await response.json();
    console.log(data)
    if(data.cod === 200) {
        mainContainer.style.display = 'block'
        errorMessage.style.display = 'none'
        getTimeAndDay();
        fetchWeather(data.coord.lat, data.coord.lon)
        setWeatherData(data)
    } else if(data.cod === '404') {
        mainContainer.style.display = 'none'
        errorMessage.style.display = 'block'
    }
}

const fetchWeather = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,&appid=${API_KEY}&units=metric`)
    const data = await response.json();
    console.log(data)
}

const setWeatherData = (data) => {
    locationName.textContent = data.name
    temperature.textContent = `${Math.floor(data.main.temp)}°C`
    weatherCondition.textContent = data.weather[0].main
    humidity.textContent = `${data.main.humidity} %`
    pressure.textContent = `${Math.floor(data.main.pressure * 0.02953)} inHg`
    visibility.textContent = `${Math.floor(data.visibility / 1000)} KM`
    wind.textContent = `${Math.floor(data.wind.speed * 3.6)} Km/hr`
    sunriseTime.textContent = formatTime(data.sys.sunrise)
    sunsetTime.textContent = formatTime(data.sys.sunset)
}

const formatTime = (time) => {
    let unixTime = time
    const date = new Date(unixTime * 1000)
    const hours = date.getHours();
    const hoursIn12Hr = hours >= 13 ? hours % 12 : hours
    const minutes = date.getMinutes()
    const ampm = hours > 12 ? 'PM' : 'AM'
    const formattedTime = `${hoursIn12Hr < 10 ? `0${hoursIn12Hr}` : hoursIn12Hr}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`
    return formattedTime
}


// Event Listeners

searchInput.addEventListener('keyup', e => {
    e.preventDefault();
    if(e.key == 'Enter' && searchInput.value != '') {
        fetchCurrentWeather(searchInput.value)
    }
})