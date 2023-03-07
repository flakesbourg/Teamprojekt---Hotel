import XMLHttpRequest from 'xhr2';

export function weather () {
  const request = new XMLHttpRequest();
  request.onload = () => {
    if (request.status === 200) {
      buildWidget(JSON.parse(request.response));
    }
  };

  request.open('GET', '/weather', true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send();
}

function buildWidget (data) {
  const weatherList = document.querySelector('.forecastList');
  for (let i = 0; i < 4; i++) {
    const weatherDay = document.querySelector('#weatherTemplate').content.cloneNode(true);
    weatherDay.querySelector('.weatherDate').innerHTML = (new Date(data.list[i * 8].dt * 1000)).toLocaleDateString('de-DE');
    weatherDay.querySelector('.weatherLogo').setAttribute('src', 'http://openweathermap.org/img/wn/' + data.list[i * 8].weather[0].icon + '@2x.png');
    weatherDay.querySelector('.temperature p').innerHTML = Math.round(data.list[i * 8].main.temp) + '°C';
    weatherDay.querySelector('.humidity p').innerHTML = data.list[i * 8].main.humidity + '%';

    weatherList.appendChild(weatherDay);
  }
}
