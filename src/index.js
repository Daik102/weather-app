import './styles.css';
import { renderPage } from './render';

async function getData(e) {
  let mode = 'twoDays';
  
  if (e) {
    if (e.target.classList.contains('search-btn') && !locationInput.value || e.key === 'Enter' && !locationInput.value) {
      return;
    } else if (e.target.classList.contains('fifteen-days-btn')) {
      mode = 'fifteenDays';
    } else if (e.target.classList.contains('hourly-btn')) {
      mode = 'hourly';
    }
  }
  
  let locationValue = '';

  if (locationInput.value) {
    locationValue = locationInput.value;
    locationInput.value = '';
  } else {
    locationValue = location;
  }

  try {
    renderPage();
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=3KUMKZJEGDSEC8FM5NGY3KZHE`, {mode:'cors'});
    const data = await response.json();
    const addressData = data.address;
    const address = addressData
      .split(' ')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .join(' ');
    let days = data.days;
    let dateData;
    
    switchBtns.forEach((btn) => btn.classList.remove('selected-btn'));

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
    localStorage.setItem('location', JSON.stringify(location));
  } catch {
    renderPage('', '', '', 'error');
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', getData);
  }
}

const locationInput = document.getElementById('location-input');
const searchBtn = document.querySelector('.search-btn');
const switchBtns = document.querySelectorAll('.switch-btn');
const hourlyBtn = document.querySelector('.hourly-btn');
const twoDaysBtn = document.querySelector('.two-days-btn');
const fifteenDaysBtn = document.querySelector('.fifteen-days-btn');

searchBtn.addEventListener('click', getData);
switchBtns.forEach((btn) => btn.addEventListener('click', getData));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const activeElement = document.activeElement;

    if (activeElement === document.body || activeElement === locationInput) {
      e.preventDefault();
      getData(e);
    }
  }
});
// Initial loading
let location = JSON.parse(localStorage.getItem('location')) || 'Tokyo';
getData();
