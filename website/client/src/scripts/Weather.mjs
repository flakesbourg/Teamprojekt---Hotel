import XMLHttpRequest from 'xhr2';

export function weather () {
  const request = new XMLHttpRequest();
  request.onload = () => {
    console.log(request.response);
  };

  request.open('GET', 'https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=50.15&lon=6.44&appid=9841b1c07c3fe1251ec36bf36876650c', true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send();
}

weather();
