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
const forecastSection = document.querySelector('.forecast-data')
const weatherIcon = document.querySelector('.weather-icon')
const infoSection = document.querySelector('.info-section')

// Functions

const getTimeAndDay = () => {
    const time = new Date()
    const day = time.getDay()
    const date = time.getDate()
    const month = time.getMonth()
    currentMonth.textContent = months[month]
    currentDay.textContent = days[day]
    currentDate.textContent = date
}

const fetchCurrentWeather = async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    const response = await fetch(url)
    const data = await response.json();
    console.log(data)
    if(data.cod === 200) {
        mainContainer.style.display = 'block'
        errorMessage.style.display = 'none'
        infoSection.style.display = 'none'
        getTimeAndDay();
        fetchWeather(data.coord.lat, data.coord.lon)
        setWeatherData(data)
    } else if(data.cod === '404') {
        mainContainer.style.display = 'none'
        errorMessage.style.display = 'block'
        infoSection.style.display = 'block'
    }
}

const fetchWeather = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,&appid=${API_KEY}&units=metric`)
    const data = await response.json();
    console.log(data)
    forecastData(data.daily)
}

const setWeatherData = (data) => {
    locationName.textContent = data.name
    temperature.textContent = `${Math.floor(data.main.temp)}°C`
    weatherCondition.textContent = data.weather[0].main
    humidity.textContent = `${data.main.humidity} %`
    pressure.textContent = `${Math.floor(data.main.pressure * 0.02953)} inHg`
    visibility.textContent = `${Math.floor(data.visibility / 1000)} KM`
    wind.textContent = `${Math.floor(data.wind.speed * 3.6)} Km/hr`
    sunriseTime.textContent = window.moment(data.sys.sunrise*1000).format('hh:mm a')
    sunsetTime.textContent = window.moment(data.sys.sunset*1000).format('hh:mm a')
    weatherIcon.src = setWeatherIcons(data.weather[0].id)

}

const forecastData = (dailyData) => {
    forecastSection.innerHTML = dailyData?.map(data => {
        const imgSource = setWeatherIcons(data.weather[0].id)
        return `<div class="forecast-section">
                    <h2 class="day-info"><span class="day">${window.moment(data.dt*1000).format('ddd')}</span>, <span class="date">${window.moment(data.dt*1000).format('Do')}</span></h2>
                    <img src=${imgSource} alt="weather icon" class="forecast-weather-icon"/>
                    <p class="temperatures"><span class="max-temp">${Math.floor(data.temp.max)}°C</span> <span class="min-temp">${Math.floor(data.temp.min)}°C</span></p>
                    <p class="weather-condition">${data.weather[0].main}</p>
                </div>`
    }).join('')
} 

const setWeatherIcons = (id) => {
    if(id >= 200 && id < 203) {
        const source = './images/thunderstorms-rain.svg'
        return source
    } else if(id >=210 && id < 233) {
        const source = './images/thunderstorms.svg'
        return source
    } else if(id >= 300 && id < 322) {
        const source = './images/drizzle.svg'
        return source
    } else if(id >= 500 && id < 532) {
        const source = './images/rain.svg'
        return source
    } else if(id >= 600 && id < 623) {
        const source = './images/snow.svg'
        return source
    } else if(id === 701) {
        const source = './images/mist.svg'
        return source
    } else if(id >= 711 && id < 772) {
        const source = './images/haze.svg'
        return source
    } else if(id === 800) {
        const source = './images/clear-day.svg'
        return source
    } else if(id === 804) {
        const source = './images/overcast.svg'
        return source
    } else if(id === 801 || id === 802) {
        const source = './images/partly-cloudy-day.svg'
        return source
    } 
}


// Event Listeners

searchInput.addEventListener('keyup', e => {
    e.preventDefault();
    if(e.key == 'Enter' && searchInput.value != '') {
        fetchCurrentWeather(searchInput.value)
        searchInput.value = ''
    }
})