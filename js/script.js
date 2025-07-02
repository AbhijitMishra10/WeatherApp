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
    })
        .catch((err) => {
            unresolveMsg()
            console.log(err);
    })

}
