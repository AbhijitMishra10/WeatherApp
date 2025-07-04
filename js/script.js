// A basic weather function which takes a parameter 'city' and returns a weather promise, either in the form of a resolved(success) one or rejected(failure) one
function weather(city) {
    return new Promise((resolve,reject) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f754573ebbd347b67508eb33c353bc25&units=metric`)
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
        alert('Enter a city name')
        return
    }

    weather(city)
        .then((data) => {
            resolveMsg()
            console.log(data);
            document.getElementById("day").textContent = new Date().toDateString()
            document.getElementById("cityName").textContent = `Weather in ${data.name}`
            document.getElementById("clouds").textContent = data.clouds.all
            document.getElementById("long").textContent = data.coord.lon
            document.getElementById("lat").textContent = data.coord.lat
            document.getElementById("temp").textContent = data.main.temp 
            document.getElementById("feels_like").textContent = data.main.feels_like           
            document.getElementById("humidity").textContent = data.main.humidity
            document.getElementById("wind").textContent = data.wind.speed
            document.getElementById("gust").textContent = data.wind.gust
            document.getElementById("degree").textContent = data.wind.deg
            document.getElementById("rain").textContent = data.rain?.['1h'] 
                                                          ?? data.rain?.['24h'] 
                                                          ?? '0'
            document.getElementById("country").textContent = data.sys.country
            document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString()
            document.getElementById("sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString()
            document.getElementById("description").textContent = `Description: ${data.weather[0].description}, Main: ${data.weather[0].main}`

            document.getElementById("weatherResult").classList.remove('hidden')
        })
        .catch((err) => {
            unresolveMsg()
            console.log(err);
            alert('Could not fetch weather report. Try again!!')
        })
    getForecast(city)
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

    const api = 'f754573ebbd347b67508eb33c353bc25'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`

    fetch(url) 
        .then(response => {
            if(!response.ok){
                throw new Error('Couldnt fetch location')
            } 
            return response.json() 
        })
        .then(data => {
            resolveMsg()
            console.log(data);

            document.getElementById("day").textContent = new Date().toDateString()
            document.getElementById("cityName").textContent = `Weather in ${data.name}`
            document.getElementById("clouds").textContent = data.clouds.all
            document.getElementById("long").textContent = data.coord.lon
            document.getElementById("lat").textContent = data.coord.lat
            document.getElementById("temp").textContent = data.main.temp 
            document.getElementById("feels_like").textContent = data.main.feels_like           
            document.getElementById("humidity").textContent = data.main.humidity
            document.getElementById("wind").textContent = data.wind.speed
            document.getElementById("gust").textContent = data.wind.gust
            document.getElementById("degree").textContent = data.wind.deg
            document.getElementById("rain").textContent = data.rain?.['1h'] 
                                                          ?? data.rain?.['24h'] 
                                                          ?? '0'
            document.getElementById("country").textContent = data.sys.country
            document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString()
            document.getElementById("sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString()
            document.getElementById("description").textContent = `Description: ${data.weather[0].description}, Main: ${data.weather[0].main}`

            document.getElementById("weatherResult").classList.remove('hidden')
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
function getForecast(city) {
    const Forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f754573ebbd347b67508eb33c353bc25&units=metric` 

    fetch(Forecast) 
        .then((res) => {
            if(!res.ok) throw new Error('Forecast cannot be fetched')
            return res.json()    
        }) 
        .then((data) => {
            const forecastList = data.list
            const dailyForecast = []

            forecastList.forEach(i => {
                if(i.dt_txt.includes("12:00:00")) {
                    dailyForecast.push(i)
                }
            });

            display(dailyForecast)

        })
        .catch(err => {
            console.log('Forecast displaying error', err);
        })

}
// This function helps to display the weather for the next 5 days,5 different cards for 5 different days with the dates of the days mentioned (filtered at 12:00:00 pm)
function display(forecast) {
    const forecastDiv = document.getElementById("forecast")
    const forecastCards = document.getElementById("forecastCards")

    forecastCards.innerHTML = ""

    forecast.forEach(i => {
        const date = new Date(i.dt_txt).toDateString()
        const cloudss = i.clouds['all']
        const temp = i.main.temp
        const wind = i.wind.speed
        const humidity = i.main.humidity
        const icon = i.weather[0].icon

        const card = document.createElement("div")
        card.className = "bg-white p-4 rounded shadow text-center"

        card.innerHTML = `<h3 class="font-semibold mb-2">${date}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png"
        class="mx-auto mb-3">       
        <p>Clouds:☁️ ${cloudss}%</p>     
        <p>Temperature: 🌡️ ${temp}°C</p>     
        <p>Wind:🌬️ ${wind} m/s</p>
        <p>Humidity:💧 ${humidity}%</p>`

        forecastCards.appendChild(card)
    })
    forecastDiv.classList.remove("hidden")
}

