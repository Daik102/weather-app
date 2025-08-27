import './styles.css';
// import { projectController, updateForProjectController } from './project-controller';

function processDays(data, day) {
  const datetime = data.days[day].datetime;
  const conditions = data.days[day].conditions;
  const tempmaxF = data.days[day].tempmax;
  const tempmaxC = Math.floor((tempmaxF -32) * 5 / 9) + '\u00B0C';
  const tempminF = data.days[day].tempmin;
  const tempminC = Math.floor((tempminF -32) * 5 / 9) + '\u00B0C';
  const precipprobData = data.days[day].precipprob;
  const precipprob = Math.round(precipprobData) + '%';

  console.log(datetime);
  console.log(conditions);
  console.log(tempmaxC);
  console.log(tempminC);
  console.log(precipprob);
}

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

async function getData(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3KUMKZJEGDSEC8FM5NGY3KZHE`, {mode:'cors'});
    const searchData = await response.json();
    const addressData = searchData.address;
    const address = addressData.charAt(0).toUpperCase() + addressData.slice(1).toLowerCase();
    console.log(address);

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

    processDays(searchData, 0);
    processDays(searchData, 1);
    processDays(searchData, 2);
    processDays(searchData, 3);
    processDays(searchData, 4);
    processDays(searchData, 5);
    processDays(searchData, 6);
    processDays(searchData, 7);
    processDays(searchData, 8);
    processDays(searchData, 9);
    processDays(searchData, 10);
    processDays(searchData, 11);
    processDays(searchData, 12);
    processDays(searchData, 13);
    processDays(searchData, 14);
  } catch {
    console.log('Sorry, no results found.');
  }
}

const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const location = document.getElementById('location').value;
  getData(location);
});
