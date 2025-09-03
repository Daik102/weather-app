import './styles.css';
import { renderPage } from './render';

const searchBtn = document.querySelector('.search-btn');
const backBtn = document.querySelector('.back-btn');
const hourlyBtn = document.querySelector('.hourly-btn');
const twoDaysBtn = document.querySelector('.two-days-btn');
const fifteenDaysBtn = document.querySelector('.fifteen-days-btn');
const dialogLoading = document.querySelector('.dialog-loading');
const dialogError = document.querySelector('.dialog-error');

async function getData(location, mode) {
  try {
    dialogLoading.showModal();
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3KUMKZJEGDSEC8FM5NGY3KZHE`, {mode:'cors'});
    const data = await response.json();
    const addressData = data.address;
    const address = addressData
      .split(' ')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .join()
      .replaceAll(',', ' ');
    let days;
    let dateData;

    dialogLoading.close();

    if (mode === 'twoDays') {
      fifteenDaysBtn.classList.remove('selected-btn');
      hourlyBtn.classList.remove('selected-btn');
      twoDaysBtn.classList.add('selected-btn');
      days = [data.days[0], data.days[1]];
      renderPage(address, days, dateData, mode);
    } else if (mode === 'fifteenDays') {
      twoDaysBtn.classList.remove('selected-btn');
      hourlyBtn.classList.remove('selected-btn');
      fifteenDaysBtn.classList.add('selected-btn');
      days = data.days;
      renderPage(address, days, dateData, mode);
    } else if (mode === 'hourly') {
      twoDaysBtn.classList.remove('selected-btn');
      fifteenDaysBtn.classList.remove('selected-btn');
      hourlyBtn.classList.add('selected-btn');
      const currentTimeData = data.currentConditions.datetime;
      const currentTime = Number(currentTimeData.slice(0,2));
      let hoursData = data.days[0].hours;
      const hours = hoursData.slice(currentTime);
      const hoursTomorrow = data.days[1].hours;
      const hoursDayAfterTomorrow = data.days[2].hours.slice(0, currentTime);
      
      dateData = data.days[0].datetime.replace(/-/g, ', ');
      const dateDataTomorrow = data.days[1].datetime.replace(/-/g, ', ');
      const dateDataDayAfterTomorrow = data.days[2].datetime.replace(/-/g, ', ');
      
      renderPage(address, hours, dateData, mode, 0);
      renderPage(address, hoursTomorrow, dateDataTomorrow, mode, 1);
      renderPage(address, hoursDayAfterTomorrow, dateDataDayAfterTomorrow, mode, 2);
    }

    locationData = location;
    localStorage.setItem('location', JSON.stringify(locationData));
  } catch {
    dialogError.showModal();
  }
}

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const locationInput = document.getElementById('location-input');

  if (locationInput.value === '') {
    return;
  }

  const preLocationData = locationInput.value;
  getData(preLocationData, 'twoDays');
  locationInput.value = '';
});

backBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dialogError.close();
  getData(locationData, 'twoDays');
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
let locationData = JSON.parse(localStorage.getItem('location')) || 'Tokyo';
getData(locationData, 'twoDays');
