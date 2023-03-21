import XMLHttpRequest from 'xhr2';

export function requestMeetingRoom () {
  const eventDate = document.getElementById('eventDate');
  eventDate.addEventListener('change', () => {
    document.getElementsByClassName('requestContainer')[0].style.display = 'none';
  });
  eventDate.min = new Date().toISOString().split('T')[0];

  const checkEvent = document.getElementById('checkEvent');
  checkEvent.addEventListener('click', () => {
    const date = document.getElementById('eventDate');
    const people = document.getElementById('numberOfPeople');
    checkDate(people.value, (new Date(date.value)).toISOString().substring(0, 10));
  });
}

function checkDate (numberOfPeople, date) {
  const request = new XMLHttpRequest();

  request.addEventListener('load', () => {
    if (request.status === 200) {
      document.getElementsByClassName('requestContainer')[0].style.display = 'flex';
      initSelect(JSON.parse(request.response));
    } else {
      document.getElementsByClassName('requestContainer')[0].style.display = 'none';
    }
  });

  request.open('GET', '/event?people=' + numberOfPeople + '&date=' + date);
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
}

function initSelect (data) {
  const selectPremise = document.getElementById('selectPremise');
  selectPremise.innerHTML = '';

  for (let i = 0; i < data.length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', data[i].size);
    option.innerHTML = data[i].size;
    selectPremise.appendChild(option);
  }
}
