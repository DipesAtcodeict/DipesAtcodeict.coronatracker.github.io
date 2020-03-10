const lastUpdated = document.querySelector('.lastUpdated');
const counts = document.querySelector('.counts');
const locations = document.querySelector('.locations');
const deathCount = document.querySelector('.deaths');
const recoveredCount = document.querySelector('.recovered');
const forYou = document.querySelector('.foryou');
const totalCasesForCurrentLocation = document.querySelector(
  '.totalCaseForCurrentLocation'
);
const totalDeathsForCurrentLocation = document.querySelector(
  '.totalDeathsForCurrentLocation'
);
const totalRecoveriesForCurrentLocation = document.querySelector(
  '.totalRecoveriesForCurrentLocation'
);

//fetching data from api
async function getCoronaData() {
  let url = `https://coronavirus-tracker-api.herokuapp.com/all`;
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

//displaying data in html
async function displayData() {
  const { confirmed, deaths, recovered } = await getCoronaData();
  showConfirmedData(confirmed, deaths, recovered);
}

//app
async function showConfirmedData(confirmed, deaths, recovered) {
  const date = new Date(confirmed.last_updated);
  lastUpdated.innerHTML = `Last Updated: <span class="info">${date.toDateString()}</span>`;
  counts.innerHTML = `Total Confirmed Cases: <span class="info">${confirmed.latest}</span>`;
  locations.innerHTML = `Total Confirmed Locations: <span class="info">${confirmed.locations.length}</span>`;
  deathCount.innerHTML = `Total Confirmed Deaths: <span class="info">${deaths.latest}</span>`;
  recoveredCount.innerHTML = `Total Confirmed Recoveries: <span class="info">${recovered.latest}</span>`;

  let totalCases = 0;
  let totalDeaths = 0;
  let totalRecoveries = 0;

  let response = await fetch(`https://ipinfo.io?token=30955b6c4d992b`);
  let data = await response.json();
  let location = data.country;
  confirmed.locations.forEach(country => {
    if (country.country_code == location) {
      totalCases = totalCases + country.latest;
    }
  });
  deaths.locations.forEach(country => {
    if (country.country_code == location) {
      totalDeaths = totalDeaths + country.latest;
    }
  });
  recovered.locations.forEach(country => {
    if (country.country_code == location) {
      totalRecoveries = totalRecoveries + country.latest;
    }
  });
  forYou.innerHTML = `For Your Current Location ${location} & TimeZone ${data.timezone}`;
  totalCasesForCurrentLocation.innerHTML = `Total Cases: <span class="info">${totalCases}</span>`;
  totalDeathsForCurrentLocation.innerHTML = `Total Deaths: <span class="info">${totalDeaths}</span>`;
  totalRecoveriesForCurrentLocation.innerHTML = `Total recoveries: <span class="info">${totalRecoveries}</span>`;
}

displayData();
