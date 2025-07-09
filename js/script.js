// A basic weather function which takes a parameter 'city' and returns a weather promise, either in the form of a resolved(success) one or rejected(failure) one
const apiKey = 'd446d6d7fbf84c0abde63545250907'

function weather(city) {
    return new Promise((resolve,reject) => {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`
        fetch(url)
            .then((response) => {
                if(!response.ok) {
                    reject('Data cannot be fetched');
                }
                return response.json()
            })
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject('Something went haywire', err)
            })
    })
}

let resolveMsg = () => console.log('Hurrayyy!!!😀, here is your report')
let unresolveMsg = () => console.log('Oopsie!😞, Couldnt fetch your data');
// This function is called everytime the mouse does a click, and it searches for the city provided in the input box, and responds with its weather if found, or else returns an err
function searchCity() {
    let city = document.getElementById("cityInput").value.trim()
    if(city === "") {
        alert('Pleas enter a city name')
        return
    }

    weather(city)
        .then((data) => {
            resolveMsg()
            console.log(data);

            const current = data.current
            const location = data.location
            const astro = data.forecast.forecastday[0].astro
            document.getElementById("day").textContent = new Date().toDateString()
            document.getElementById("cityName").textContent = `Weather in ${data.location.name}`
            document.getElementById("clouds").textContent = current.cloud
            document.getElementById("long").textContent = location.lon
            document.getElementById("lat").textContent = location.lat
            document.getElementById("temp").textContent = current.temp_c 
            document.getElementById("feels_like").textContent = current.feelslike_c           
            document.getElementById("humidity").textContent = current.humidity
            document.getElementById("wind").textContent = current.wind_kph
            document.getElementById("gust").textContent = current.gust_kph
            document.getElementById("degree").textContent = current.wind_degree
            document.getElementById("rain").textContent = current.precip_mm ?? '0'
            document.getElementById("country").textContent = location.country
            document.getElementById("sunrise").textContent = astro.sunrise
            document.getElementById("sunset").textContent = astro.sunset
            document.getElementById("description").textContent = `Description: ${current.condition.text}, Main: ${current.condition.text}`

            document.getElementById("weatherResult").classList.remove('hidden')
        
            getForecast(data.forecast.forecastday)
        })
        .catch((err) => {
            unresolveMsg()
            console.log(err);
            alert('Could not fetch weather report. Try again!!')
        })
}

// This function is called when there is need of finding the weather of the current location it takes two callback functions, onSuccess and error, it fetches it when the Current Location button is clicked
function getLocation() {
    if(!navigator.geolocation){
        alert('Geolocation is not supported by the browser')
        return
    }

    navigator.geolocation.getCurrentPosition(onSuccess,error)
}
// This returns a resolved promise based on the success of getting the weather of the current location or sends an error if the promise is rejected
function onSuccess(position) {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    const prob =  `${lat}, ${lon}`

    weather(prob) 
        .then((data) => {
            resolveMsg()
            console.log(data);

            const current = data.current
            const location = data.location
            const astro = data.forecast.forecastday[0].astro
            
            document.getElementById("day").textContent = new Date().toDateString()
            document.getElementById("cityName").textContent = `Weather in ${data.location.name}`
            document.getElementById("clouds").textContent = current.cloud
            document.getElementById("long").textContent = location.lon
            document.getElementById("lat").textContent = location.lat
            document.getElementById("temp").textContent = current.temp_c 
            document.getElementById("feels_like").textContent = current.feelslike_c           
            document.getElementById("humidity").textContent = current.humidity
            document.getElementById("wind").textContent = current.wind_kph
            document.getElementById("gust").textContent = current.gust_kph
            document.getElementById("degree").textContent = current.wind_degree
            document.getElementById("rain").textContent = current.precip_mm ?? '0'
            document.getElementById("country").textContent = location.country
            document.getElementById("sunrise").textContent = astro.sunrise
            document.getElementById("sunset").textContent = astro.sunset
            document.getElementById("description").textContent = `Description: ${current.condition.text}, Main: ${current.condition.text}`

            document.getElementById("weatherResult").classList.remove('hidden')
        
            getForecast(data.forecast.forecastday)
        })
        .catch((err) => {
            unresolveMsg()
            console.log('Location fetch failed', err);
            alert('Location could not be fetched for the current location')
        })
    }
function error() {
    alert('Unable to find the location')
}

// This function also takes a parameter city, which is provided via the input field and gives the updated weather every 3 hours for the next 5 days
function getForecast(forecastList) {
   
    const forecastDiv = document.getElementById("forecast")
    const forecastCards = document.getElementById("forecastCards")

    forecastCards.innerHTML = ""

    forecastList.forEach(day => {
        const date = new Date(day.date).toDateString()
        const cloudss = day.day.daily_chance_of_rain ?? 0
        const temp = day.day.avgtemp_c
        const wind = day.day.maxwind_kph
        const humidity = day.day.avghumidity
        const icon = day.day.condition.icon

        const card = document.createElement("div")
        card.className = "bg-white p-4 rounded shadow text-center"

        card.innerHTML = `<h3 class="font-semibold mb-2">${date}</h3>
        <img src="https:${icon}" class="mx-auto mb-3" alt="icon">       
        <p>Clouds:☁️ ${cloudss}%</p>     
        <p>Temperature: 🌡️ ${temp}°C</p>     
        <p>Wind:🌬️ ${wind} kph</p>
        <p>Humidity:💧 ${humidity}%</p>`

        forecastCards.appendChild(card)
    })
    forecastDiv.classList.remove("hidden")
}

