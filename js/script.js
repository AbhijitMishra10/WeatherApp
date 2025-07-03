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
                reject('Something went haywire' + err)
            })
    })
}

let resolveMsg = () => console.log('Hurra!!!😀, here is your report')
let unresolveMsg = () => console.log('Oopsie!😞, Couldnt fetch your data');

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
}

function getLocation() {
    if(!navigator.geolocation){
        alert('Geolocation is not supported by the browser')
        return
    }

    navigator.geolocation.getCurrentPosition(onSuccess,error)
}

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

