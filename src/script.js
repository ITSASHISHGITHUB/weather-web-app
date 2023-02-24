let desiredLocation = "Ranchi";
let temp;
let fTemp = document.querySelector("#fahreinheit");
let celBtn = document.querySelector("#celsius");
window.addEventListener("DOMContentLoaded", () => {
  let cancelIcon = document.querySelector("#cancel");
  let cancelBtn = document.querySelector("#cancel-btn");
  let submitBtn = document.querySelector("#sub-btn");
  let changeLocation = document.querySelector("#change-loc");
  let modal = document.querySelector("#modal");
  let location = document.getElementById("loc");

  fTemp.addEventListener("click", (event) => {
    event.preventDefault();
    getTempF();
  });

  celBtn.addEventListener("click", (event) => {
    event.preventDefault();
    celTemp();
  });

  function closeModal() {
    modal.classList.toggle("flex");
    modal.classList.toggle("hidden");
  }

  changeLocation.addEventListener("click", () => {
    closeModal();
  });

  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
    desiredLocation = location.value;
    console.log(desiredLocation);
    getWeather();
    celTemp();
  });

  cancelIcon.addEventListener("click", () => {
    closeModal();
  });
  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
  });
});

console.log(desiredLocation);

async function getWeather() {
  try {
    const response = await fetch(
      `https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${desiredLocation}&contentType=json&unitGroup=metric&shortColumnNames=0`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "b9fa4c2347mshfc4aa1d69be1d12p177b2bjsn80208f3f2cda",
          "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com",
        },
      }
    );
    //.then((response) => response.json())

    const content = await response.json();
    console.log(content);
    const data = content.locations[desiredLocation];

    //?Inserting data into the html

    let dispLocation = document.getElementById("desiredLocation");
    let add = data.address.split(",");
    dispLocation.innerText = add[0];
    document.getElementById("state").innerText = add[1] + "," + add[2];
    const currentData = data.currentConditions;

    temp = currentData.temp;
    if (temp) {
      document.getElementById("temp").innerHTML = temp;
    } else {
      document.getElementById("temp").innerHTML = ":(";
      alert(`unable to fetch temperature of ${desiredLocation}`);
    }

    document.getElementById("humidity").innerText = currentData.humidity;
    document.getElementById("pressure").innerText =
      currentData.sealevelpressure + " mb";
    document.getElementById("visibility").innerText =
      currentData.visibility + " km";
    if (currentData.wspd) {
      document.getElementById("windspd").innerText = currentData.wspd + " kmph";
    }
    document.getElementById("dewpoint").innerText = currentData.dew;
    document.getElementById("weatherCond").innerText = currentData.icon;

    //?api returns datetime="2022-09-02T15:30:00+05:30"
    //?split date and time on the basis of "T"

    const date = currentData.datetime.split("T");

    //?to test else case of AM of PM
    //const date = "2022-09-02T11:30:00+05:30".split("T");

    console.log(date);
    //?date[1] contains time -after "T"
    //?split time from time Zone-5:30 basis "+"
    const time = date[1].split("+");

    //?time[0] has the time

    let currTime = time[0].split(":"); //?split hour minute and second into array basis ":"

    //?for AM and PM

    if (parseInt(time[0]) > 12) {
      document.getElementById("time").innerText =
        parseInt(currTime[0]) - 12 + ":" + currTime[1] + " PM";
    } else {
      document.getElementById("time").innerText =
        currTime[0] + ":" + currTime[1] + " AM";
    }

    //? for date - date[0] contains date

    let currDate = date[0].split("-");
    console.log(currDate);

    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let dayName = [
      ,
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Friday",
      "Saturday",
    ];
    let sup = "";
    if (currDate[2] == 1 || currDate[2] == 21 || currDate[2] == 31) {
      sup = "st";
    } else if (currDate[2] == 2 || currDate[2] == 22) {
      sup = "nd";
    } else if (currDate[2] == 3 || currDate[2] == 23) {
      sup = "rd";
    } else {
      sup = "th";
    }

    let d = new Date();

    document.getElementById("date").innerHTML =
      dayName[d.getDay()] +
      " , " +
      currDate[2] +
      "<sup>" +
      sup +
      "</sup>" +
      " " +
      monthNames[parseInt(currDate[1]) - 1].slice(0, 3) +
      " " +
      currDate[0];

    console.log(currDate[1]);
  } catch (error) {
    console.log(error);
  }
}

getWeather();

function toggleCnF() {
  fTemp.classList.add("text-white");
  fTemp.classList.remove("text-[rgba(255,255,255,0.5)]");
  celBtn.classList.remove("text-white");
  celBtn.classList.add("text-[rgba(255,255,255,0.5)]");
}

function getTempF() {
  const fahrenheit = Math.floor(temp * 1.8 + 32);
  document.getElementById("temp").innerHTML = fahrenheit;
  toggleCnF();
}

function celTemp() {
  document.getElementById("temp").innerHTML = temp;
  fTemp.classList.remove("text-white");
  fTemp.classList.add("text-[rgba(255,255,255,0.5)]");
  celBtn.classList.add("text-white");
  celBtn.classList.remove("text-[rgba(255,255,255,0.5)]");
}
