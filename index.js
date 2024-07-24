// first fetch all the data that we need to use in the code.
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially vairables need????

let curerntTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
curerntTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
    if(clickedTab != curerntTab) {
        curerntTab.classList.remove("current-tab");
        curerntTab = clickedTab;
        curerntTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible.
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h.
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mye your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

//switchTab function likhne se phle ye eventListner lgaengye.
userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage.
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        // Agar local coordinates are present.
        // JSON.parse() ki help se coordinates ko java script objet mye convert krengye.
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}


async function fetchUserWeatherInfo(coordinates)
{
    const {lat , lon} = coordinates;
    //make grantcontainer invisible.
    grantAccessContainer.classList.remove("active");
    //make loader visible.
    loadingScreen.classList.add("active");

    //API call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        // loading wali screen remove krdengye jaise hi data mill jaega.
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW
    }
}

function renderWeatherInfo(weatherInfo){
   //Sbse phle saare element fetch krke laaengye.
   //jo element hme render kraane hain.
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryIcon]");
   const desc = document.querySelector("[data-weatherDesc]");
   const weatherIcon = document.querySelector("[data-weatherIcon]");
   const temp = document.querySelector("[data-temp]");
   const windspeed = document.querySelector("[data-windspeed]");
   const humidity = document.querySelector("[data-humidity]");
   const cloudyness = document.querySelector("[data-cloudiness]");  

   //fetch Value from weatherInfo object and put it in UI object.
   //understand meaning of this -> (?.) from viedo on 1 hour 15 min time stamp.
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   //wheatherInfo ke andar gya weather mye . phir weather mye gya phle element mye [0] kyun ki ye ek array tha
   //phir uske andar description mye gya.
   desc.innerText = weatherInfo?.weather?.[0].description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = ` ${weatherInfo?.main?.temp} °C`;
   windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = `${weatherInfo?.main?.humidity}%`;
   cloudyness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation()
{
    if(navigator.geolocation)
    {
        // here we pass a call back function.
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("geolocation are not supported");
    }
}

function showPosition(position){
    //creating an object having lat lon.
    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

//apply listner on grantAccess button.
const grantAccesButton = document.querySelector("[data-grantAccess]");
grantAccesButton.addEventListener('click' , getLocation);

//writing search function apply addEvent listner here also.
let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

// is function mye city name ke base pe API call krengye.
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
        console.log("Here we got an error in the code")
    }
} 