import './styles.css';
import { renderData } from './render';

function processHours(data, hour) {
  const datetime = data.days[0].hours[hour].datetime;
  const conditions = data.days[0].hours[hour].conditions;
  const tempF = data.days[0].hours[hour].temp;
  const tempC = Math.floor((tempF -32) * 5 / 9) + '\u00B0C';
  const precipData = data.days[0].hours[hour].precip;
  const precip = Math.round(precipData) + 'mm';

  console.log(datetime);
  console.log(conditions);
  console.log(tempC);
  console.log(precip);
}

const searchBtn = document.querySelector('.search-btn');
const dialogError = document.querySelector('.dialog-error');
const backBtn = document.querySelector('.back-btn');
const twoDaysBtn = document.querySelector('.two-days-btn');
const fifteenDaysBtn = document.querySelector('.fifteen-days-btn');

async function getData(location, mode) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3KUMKZJEGDSEC8FM5NGY3KZHE`, {mode:'cors'});
    const data = await response.json();
    const addressData = data.address;
    const address = addressData.charAt(0).toUpperCase() + addressData.slice(1).toLowerCase();
    renderData(address, data, mode);

    /*
    processHours(searchData, 0);
    processHours(searchData, 1);
    processHours(searchData, 2);
    processHours(searchData, 3);
    processHours(searchData, 4);
    processHours(searchData, 5);
    processHours(searchData, 6);
    processHours(searchData, 7);
    processHours(searchData, 8);
    processHours(searchData, 9);
    processHours(searchData, 10);
    processHours(searchData, 11);
    processHours(searchData, 12);
    processHours(searchData, 13);
    processHours(searchData, 14);
    processHours(searchData, 15);
    processHours(searchData, 16);
    processHours(searchData, 17);
    processHours(searchData, 18);
    processHours(searchData, 19);
    processHours(searchData, 20);
    processHours(searchData, 21);
    processHours(searchData, 22);
    processHours(searchData, 23);
    */
  } catch {
    dialogError.showModal();
  }
}

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const locationInput = document.getElementById('location-input');
  locationData = locationInput.value;
  getData(locationData, 'twoDays');
  locationInput.value = '';
});

backBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dialogError.close();
});

twoDaysBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getData(locationData, 'twoDays');
});

fifteenDaysBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getData(locationData, 'fifteenDays');
});

// Initial loading
let locationData = 'Tokyo';
getData('Tokyo', 'twoDays');
