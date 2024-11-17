const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
  currentLocation = document.getElementById("location"),
  description = document.getElementById("description"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIcon = document.getElementById("icon"),  
  windSpeed = document.querySelector(".wind-speed"),
  humidity = document.querySelector(".humidity"),
  visibility = document.querySelector(".visibility"),
  humidityStatus = document.querySelector(".humidity-status"),
  windStatus = document.querySelector(".wind-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibility-status");
  weatherCards = document.querySelector("#weather-cards"),
  celciusBtn = document.querySelector(".celcius"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query");
 
let currentCity = "";
let currentUnit = "C";
let hourlyorWeek = "Week";

function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  hour = hour % 12;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);
function getPublicIp() {
  fetch("https://geolocation-db.com/json/",
  {
    method: "GET",
  })
    .then((response) => response.json())
      .then((data) => {
        console.log(data);
        currentCity = data.city;
        getWeatherData(data.city, currentUnit, hourlyorWeek);
    });
}
getPublicIp();
function getWeatherData(city, unit, hourlyorWeek) {
  console.log(city);
  const apiKey = "2VXNCLWCN2QYBZTHRJU89EP8Q";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=2VXNCLWCN2QYBZTHRJU89EP8Q&contentType=json`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
  
    .then((data) => {
      let today = data.currentConditions;
      if (unit === "C") {
        temp.innerText = today.temp;
      }
      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      description.innerText = "Description: " + data.description;
      rain.innerText = "Perc -" + today.precip + "%";
      windSpeed.innerText = today.windspeed;
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;
      measureHumidityStatus(today.humidity);
      measurewindStatus(today.windspeed);
      measureairStatus(today.winddir);
      measurevisibilityStatus(today.visibility);
      mainIcon.src = getIcon(today.icon);
      if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      } else {
        updateForecast(data.days, unit, "week");        
      }
    })
    .catch((err)=>{
    alert("Invalid Entry ");
  });
  }

function measureHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 65) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}
function measurewindStatus(windSpeed) {
  if (windSpeed <= 10) {
    windStatus.innerText = "Low";
  } else if (windSpeed <= 15) {
    windStatus.innerText = "Moderate";
  } else {
    windStatus.innerText = "High";
  }
}
function measureairStatus(airQuality) {
  if (airQuality <= 90) {
    airQualityStatus.innerText = "Good";
  } else if (airQuality <= 180) {
    airQualityStatus.innerText = "Poor";
  } else {
    airQualityStatus.innerText = "Bad";
  }
}
function measurevisibilityStatus(visibility) {
  if (visibility <= 2) {
    visibilityStatus.innerText = "Low";
  } else if (airQuality <= 5) {
    visibilityStatus.innerText = "Moderate";
  } else {
    visibilityStatus.innerText = "High";
  }
}

function getIcon(condition) {
  if (condition === "Partly-cloudy-day") {
    return "icons/sun/27.png";
  } else if (condition === "partly-cloudy-night") {
    return "icons/moon2.png";
  } else if (condition === "rain") {
    return "icons/rain.png";
  } else if (condition === "clear-day") {
    return "icons/clear.png";
  } else if (condition === "clear-night") {
    return "icons/moon1.png";
  } else {
    return "icons/cloud.png";
  }
}

function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}
function getHour(time) {
  let hour = time.split(":")[0];
  let min = time.split(":")[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}
function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }
    let dayTemp = data[day].temp;
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    card.innerHTML = `
            <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
      `;
    weatherCards.appendChild(card);
    day++;
  }
}


celciusBtn.addEventListener("click", () => {
  changeUnit("C");
});

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
});