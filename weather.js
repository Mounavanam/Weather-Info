const weatherForm= document.querySelector(".weatherForm");
const cityInput=document.querySelector(".cityinput");
const card=document.querySelector(".card");
const apikey="ed5955f575e4f4d7283cbf91dc687cda";
const locationBtn=document.getElementById("mylocation");

// add event listener to location btn...
locationBtn.addEventListener("click", event => {
    event.preventDefault();
    // checking if the browser allows geolocation access.
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
    }
    else{
        console.log("Geolocation is not supported by this browser.")
    }
});

//function to get coordinates.
 function successCallback(position){
     const lat=position.coords.latitude;
     const long=position.coords.longitude;
     // call the func to fetch weather data.
     getWeatherByCoords(lat,long);
 }

 function errorCallback(error){
     console.error("Error getting geolocation:", error.message);
 }


 async function getWeatherByCoords(latitude,longitude){
     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;

     try{
         const response = await fetch(apiUrl);
         if(!response.ok){
             throw new Error("Could not fetch weather info, please try again later.")
         }
         const weatherData= await response.json();
         displayWeatherInfo(weatherData);
     }
     catch(error){
         console.log(error);
         displayError(error.message);
     }
 }


// add event listener to form that takes input from user.
weatherForm.addEventListener("submit",  async event=>{
    event.preventDefault();
    const city= cityInput.value;
    if(city){
        try{
             // func to get and display weather data
             const weatherData= await getWeatherData(city);
             displayWeatherInfo(weatherData);
        }
        catch(error){
            console.log(error);
            displayError(error);
        }

    }
    else{
        displayError("Please enter a city name");
    }

});

 // func to fetch the weather data.
async function getWeatherData(city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

    const response=await fetch(apiUrl);
    if(!response.ok){
        throw new Error("Could not fetch weather data, enter correctly!");
    }

    return await response.json();
}

// func to display
function displayWeatherInfo(data){
    // array an dobject destructuring of data from console.
    const {name: city,
           main: {temp,humidity},
           weather:[{description,id}]} =data;
    //set card style display to flex from none in html file.
    card.textContent="";
    card.style.display="flex";

    //create necessary element tags.

    const cityDisplay=document.createElement("h1");
    const tempDisplay=document.createElement("p");
    const humidityDisplay=document.createElement("p");
    const descDisplay=document.createElement("p");
    const weatherEmoji=document.createElement("p");

    /*change the text content of each of these elements with the corresponding data.*/
    cityDisplay.textContent= city;
    tempDisplay.textContent=`${((temp - 273.15)*9/5 + 32).toFixed(1)}°F`;
    humidityDisplay.textContent=` Humidity: ${humidity}%`;
    descDisplay.textContent=description;
    weatherEmoji.textContent=getWeatherEmoji(id);

    /* now add the already witten css styles to these elements*/

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    //now append them to the card to make their visibility on screen.

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

// func to get emoji image based on id using switch.
function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId >=200 && weatherId<300):
            return "⛈️";
        case(weatherId >=300 && weatherId<400):
            return "🌧️";
        case(weatherId >=500 && weatherId<600):
            return "☔️";
        case(weatherId >=600 && weatherId<700):
            return "❄️";
        case(weatherId >=700 && weatherId<800):
            return "🌪️";
        case(weatherId === 800):
            return "🌞";
        case(weatherId >=801 && weatherId< 810):
            return "☁️";
        default:
            return "⁉️";
    }

}

// func to display errors.
function displayError(message){
    const errorDisplay=document.createElement("p");
    errorDisplay.textContent=message;/* adding content into the created p element*/
    errorDisplay.classList.add("errorDisplay");/* adding the css style to p element*/
    /* enclosing our error message inside a card */
    card.textContent="";
    card.style.display="flex";
    card.appendChild(errorDisplay);
}