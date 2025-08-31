import './styles.css';
import { renderData } from './render';

const searchBtn = document.querySelector('.search-btn');
const dialogError = document.querySelector('.dialog-error');
const backBtn = document.querySelector('.back-btn');
const hourlyBtn = document.querySelector('.hourly-btn');
const twoDaysBtn = document.querySelector('.two-days-btn');
const fifteenDaysBtn = document.querySelector('.fifteen-days-btn');

async function getData(location, mode) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3KUMKZJEGDSEC8FM5NGY3KZHE`, {mode:'cors'});
    const data = await response.json();
    const addressData = data.address;
    const address = addressData.charAt(0).toUpperCase() + addressData.slice(1).toLowerCase();
    let days;
    let dateData;
    
    if (mode === 'twoDays') {
      days = [data.days[0], data.days[1]];
      renderData(address, days, dateData, mode);
    } else if (mode === 'fifteenDays') {
      days = data.days;
      renderData(address, days, dateData, mode);
    } else if (mode === 'hourly') {
      const currentTimeData = data.currentConditions.datetime;
      const currentTime = Number(currentTimeData.slice(0,2));

      let hoursData = data.days[0].hours;
      const hours = hoursData.slice(currentTime);
      const hoursTomorrow = data.days[1].hours;
      const hoursDayAfterTomorrow = hoursData.slice(0, currentTime);
      
      dateData = data.days[0].datetime.replace(/-/g, ', ');
      const dateDataTomorrow = data.days[1].datetime.replace(/-/g, ', ');
      const dateDataDayAfterTomorrow = data.days[2].datetime.replace(/-/g, ', ');
      
      renderData(address, hours, dateData, mode, 0);
      renderData(address, hoursTomorrow, dateDataTomorrow, mode, 1);
      renderData(address, hoursDayAfterTomorrow, dateDataDayAfterTomorrow, mode, 2);
    }    
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

hourlyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getData(locationData, 'hourly');
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
