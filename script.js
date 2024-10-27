const tempDiv = document.getElementById("temp");
const timeDiv = document.getElementById("time");
const locationDiv = document.getElementById("location");
const conditionDiv = document.getElementById("condition");
const inputSearch = document.getElementById("input-search");
const inputBtn = document.getElementById("input-button");
const form = document.getElementById("form");
const forecastDiv = document.getElementById("forecast");
const forecastDay1 = document.getElementById("forecast-day-1");
const forecastDay2 = document.getElementById("forecast-day-2");

let searchLoacation;

const loadingScreen = () => {
    tempDiv.innerHTML = `<div class="loader-container">
                            <div class="bouncing-dots">
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                            </div>
                        </div>`;
    locationDiv.innerText = "";
    timeDiv.innerText = "";
    conditionDiv.innerHTML = "";
}

const gatherInfo = async (searchLoacation) => {
    let url = `https://api.weatherapi.com/v1/current.json?key=b6045a225b9342e5afd15235241610&q=${searchLoacation}&aqi=no`;

    const res = await fetch(url);
    const data = await res.json();    
    
    console.log(data);

    let locationCity = data.location.name;
    let locationCountry = data.location.country;
    let time = data.location.localtime;
    let temp = data.current.temp_c;
    let condition = data.current.condition.text;
    let conditionIcon = data.current.condition.icon;

    updateDetails(temp, locationCity, locationCountry, time, condition, conditionIcon)
    return
}

const gatherForecast = async (searchLoacation) => {
    let url = `https://api.weatherapi.com/v1/forecast.json?key=b6045a225b9342e5afd15235241610&q=${searchLoacation}&days=3&aqi=no&alerts=no`;
    const res = await fetch(url);
    const data = await res.json();
    let date;

    console.log(data);
    let forecastsDays = [], forecastsTemp = [], forecastsConditions = [], foreCastsConditionsIcons = [];
    const forecastElements = [forecastDay1, forecastDay2];
    
    for (let i = 1; i < 3; i++) {
        forecastsTemp.push(data.forecast.forecastday[i].day.maxtemp_c);
        forecastsConditions.push(data.forecast.forecastday[i].day.condition.text);
        foreCastsConditionsIcons.push(data.forecast.forecastday[i].day.condition.icon);
        date = data.forecast.forecastday[i].date;
        forecastsDays.push(getDayName(new Date(date).getDay()));

        forecastElements[i - 1].innerHTML += `<p>${forecastsDays[i - 1]}</p> 
        <p class="forecast-temp">${forecastsTemp[i - 1]}°C</p>
        <span><img src="${foreCastsConditionsIcons[i - 1]}" />  
        `
    }
    forecastDiv.classList.remove("disabled");

    return
}

const updateDetails = (temp, locationCity, locationCountry, time, condition, conditionIcon) => {
    let splitDate = time.split(" ")[0];
    let splitTime = time.split(" ")[1];
    let currentDay = getDayName(new Date(splitDate).getDay());

    tempDiv.innerHTML = `<p>${temp}°C</p>`;
    locationDiv.innerText = locationCity + ", " + locationCountry;
    timeDiv.innerText = `${splitDate} ${currentDay} ${splitTime}`;
    conditionDiv.innerHTML = `<img src="${conditionIcon}" /> <p>${condition}</p>`;
}

function search(e) {
    loadingScreen();
    e.preventDefault();
    target = inputSearch.value;

    gatherInfo(target);
    gatherForecast(target);
    return
}

function getDayName(num) {
    switch(num) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
    }
}

// Event listeners for search button and hitting enter key
inputBtn.addEventListener("click", search);

inputSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        search(e);
    }
})
