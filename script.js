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

const loading = document.querySelector('.loading');

const bar = document.querySelectorAll('.bar');

const app = document.querySelector('.app');
const navbar = document.querySelector('.navbar');

//fetching data from api
async function getCoronaData() {
  let url = `https://coronavirus-tracker-api.herokuapp.com/all`;
  let response = await fetch(url);
  let data = await response.json();
  return data;
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

//loading animation
function wait(ms) {
  return new Promise(function(resolve, reject) {
    setTimeout(function wait() {
      resolve(ms);
    }, ms);
  });
}

let flag = true;

function scale(ele) {
  if (flag == true) {
    ele.style.transform = 'scale(0.5)';
  } else {
    ele.style.transform = 'scale(1)';
  }
}

async function runLoader(stop) {
  let i;
  for (i = 0; i < bar.length; i++) {
    await wait(50);
    scale(bar[i]);
    if (i == bar.length - 1) {
      i = -1;
      flag = !flag;
    }
  }
}

window.addEventListener('load', async () => {
  loading.setAttribute('style', 'display:flex');
  runLoader();
  const data = await getCoronaData();
  if (data) {
    const { confirmed, deaths, recovered } = data;
    showConfirmedData(confirmed, deaths, recovered);
    loading.setAttribute('style', 'display:none');
    app.setAttribute('style', 'display:flex');
    navbar.setAttribute('style', 'display:block');
  }
});
