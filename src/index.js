import './styles.css';
import { renderPage } from './render';


const switchBtns = document.querySelectorAll('.switch-btn');
const searchBtn = document.querySelector('.search-btn');
const hourlyBtn = document.querySelector('.hourly-btn');
const twoDaysBtn = document.querySelector('.two-days-btn');
const fifteenDaysBtn = document.querySelector('.fifteen-days-btn');
const backBtn = document.querySelector('.back-btn');
const dialogLoading = document.querySelector('.dialog-loading');
const dialogError = document.querySelector('.dialog-error');

async function getData(locationValue, mode) {
  try {
    dialogLoading.showModal();
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=3KUMKZJEGDSEC8FM5NGY3KZHE`, {mode:'cors'});
    const data = await response.json();
    const addressData = data.address;
    const address = addressData
      .split(' ')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .join(' ');
    let days = data.days;
    let dateData;
    
    dialogLoading.close();

    switchBtns.forEach((btn) => {
      btn.classList.remove('selected-btn');
    });

    if (mode === 'twoDays') {
      twoDaysBtn.classList.add('selected-btn');
      days = [data.days[0], data.days[1]];
      renderPage(address, days);
    } else if (mode === 'fifteenDays') {
      fifteenDaysBtn.classList.add('selected-btn');
      renderPage(address, days);
    } else {
      hourlyBtn.classList.add('selected-btn');
      const currentTimeData = data.currentConditions.datetime;
      const currentTime = Number(currentTimeData.slice(0,2));
      const hoursData = data.days[0].hours;
      const hoursToday = hoursData.slice(currentTime);
      const hoursTomorrow = data.days[1].hours;
      const hoursDayAfterTomorrow = data.days[2].hours.slice(0, currentTime);
      const wholeHours = [...hoursToday, ...hoursTomorrow, ...hoursDayAfterTomorrow];
      
      dateData = data.days.slice(0, 3).map((item) => item.datetime.replace(/-/g, ', '));
      renderPage(address, wholeHours, dateData);
    }

    location = locationValue;
    localStorage.setItem('location', JSON.stringify(locationValue));
  } catch {
    dialogError.showModal();
  }
}

const locationInput = document.getElementById('location-input');

searchBtn.addEventListener('click', () => {
  const locationValue = locationInput.value;

  if (locationValue === '') {
    return;
  }

  locationInput.value = '';
  getData(locationValue, 'twoDays');
});

hourlyBtn.addEventListener('click', () => {
  getData(location, 'hourly');
});

twoDaysBtn.addEventListener('click', () => {
  getData(location, 'twoDays');
});

fifteenDaysBtn.addEventListener('click', () => {
  getData(location, 'fifteenDays');
});

backBtn.addEventListener('click', () => {
  dialogError.close();
  getData(location, 'twoDays');
});

document.addEventListener('keydown', (e) => {
  const locationValue = locationInput.value;
  
  if (e.key === 'Enter') {
    e.preventDefault();

    if (locationValue === '') {
      return;
    }
    
    locationInput.value = '';
    getData(locationValue, 'twoDays');
  }
});

// Initial loading
let location = JSON.parse(localStorage.getItem('location')) || 'Tokyo';
getData(location, 'twoDays');
