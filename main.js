const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='1c88722e7609cfe1cf0d0b53370f1c8a';
const timeZone = document.querySelector('.timeZone');
const weatherForecastEl = document.getElementById('weather-forecast');
const hourlyForecastEl = document.getElementById('hourly-forecast');
const timeEl = document.querySelector('.date_time');

//拿時間
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'
    // console.log(time)
    timeZone.innerHTML = days[day] + ', ' + date+ ' ' + months[month];

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
    }, 1000);
//拿主要天氣資訊
let weather = {
    "apiKey": "1c88722e7609cfe1cf0d0b53370f1c8a",
    fetchWeather: function (city){
        fetch("http://api.openweathermap.org/data/2.5/weather?q="
         + city 
         + "&units=metric&appid=" 
         + this.apiKey
         )
        .then((response) => response.json())
        .then(data => { 
            this.displayWeather(data);
            // console.log(data)
            //拿經緯度
            let { lon , lat } = data.coord;
            // console.log(lon , lat)

            //同時呼叫此函式去抓七天天氣資訊
            getWeatherData(lon , lat);

            getHourlyWeatherData (lon , lat);
        });
    },
    displayWeather: function(data){
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp,  humidity } = data.main;
        const { speed } = data.wind;
        // console.log(name, icon, description, temp,humidity,speed);
        // console.log(data);
        document.querySelector('.city').innerHTML = "Weather in " + name;
        document.querySelector('.icon').src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = (temp).toFixed(1) +"°C";
        document.querySelector('.humidity').innerText = "Humidity: " + humidity + "%";
        document.querySelector('.wind').innerText = "Wind speed: " + speed + " km/h";
        document.querySelector('.weather').classList.remove('loading');
        document.querySelector('.container').style.background = "url('https://source.unsplash.com/1600x900/?" + name + "')" +"center center" + "/" + "cover";


        
    },
    search: function(){
        this.fetchWeather(document.querySelector('.search-bar').value);
    }
};



//拿未來七天天氣資訊
function getWeatherData (lon , lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        showWeatherData(data);
    });
}
//拿小時資訊
function getHourlyWeatherData (lon , lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,minutely,current,alerts&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        showHourlyData(data);
    });
}

//顯示資訊在網頁
function showWeatherData (data){
    let otherDayForcast = ''

    data.daily.forEach((day , idx) => {
        if(idx == 0){

        }else if(idx <= 5){

            otherDayForcast += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon" class="w-icon">
                    <div class="temp">${(day.temp.day).toFixed(1)}°C</div>
                </div>
                
                `;
        }
        

    });
    weatherForecastEl.innerHTML = otherDayForcast;
}

function showHourlyData(data){
        let otherHoulryForcast = ''
        data.hourly.forEach((hour , idx) => {
            if(idx == 0){

               
            }else if(idx <= 5){
                
                otherHoulryForcast += `
                        <div class="weather-hourly-item">
                            <div class="day">${window.moment(hour.dt*1000).format('ha')}</div>
                            <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="weather icon" class="w-icon">
                            <div class="temp">${(hour.temp).toFixed(1)}°C</div>
                        </div>
                `;
            }
        });
    
    hourlyForecastEl.innerHTML = otherHoulryForcast;
}
//search bar
document.querySelector('.search button').addEventListener('click',function(){
    weather.search();
});
document.querySelector('.search-bar').addEventListener('keyup',function(e){
    if(event.key == 'Enter'){
        weather.search();
    }
});

//預設台北
weather.fetchWeather("Taipei");