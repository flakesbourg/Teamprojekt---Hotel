import XMLHttpRequest from 'xhr2';

export function myBooking () {
  const backToPrevious = document.getElementsByClassName('backToPreviousSite')[0];
  backToPrevious.onclick = () => {
    window.location.href = '/';
  };

  const bookingNumberInput = document.getElementById('bookingNumber');
  const bookingNumberButton = document.getElementById('getBooking');

  const params = new URLSearchParams(window.location.search);
  if (params.get('id') !== null) {
    bookingNumberInput.value = params.get('id');
  }

  bookingNumberButton.onclick = () => {
    const request = new XMLHttpRequest();

    request.addEventListener('load', () => {
      bookingNumberInput.value = '';
      if (request.status === 200) {
        loadBooking(JSON.parse(request.response));
      } else {
        window.alert('Buchungsnummer nicht vergeben.');
      }
    });

    request.open('GET', '/order/' + bookingNumberInput.value);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();
  };
}

function loadBooking (data) {
  const booking = document.querySelector('#bookingDetails').content.cloneNode(true);

  document.querySelector('#newArrivalDate').value = (new Date(data.arrival)).toISOString().substring(0, 10);
  document.querySelector('#newDepartureDate').value = (new Date(data.departure)).toISOString().substring(0, 10);

  booking.querySelector('.bookingNumber p').innerHTML = data.id;
  booking.querySelector('.checkIn h4').innerHTML = (new Date(data.arrival)).toLocaleDateString('de-DE');
  booking.querySelector('.checkOut h4').innerHTML = (new Date(data.departure)).toLocaleDateString('de-DE');
  booking.querySelector('.bookingTotal h4').innerHTML = 'Summe für ' + data.nights + ' Nächte in ' + data.rooms + ' Zimmer/n:';
  booking.querySelector('.bookingTotal h3').innerHTML = '€ ' + data.price;

  booking.querySelector('#cancelBooking').onclick = () => {
    if (window.confirm('Sind Sie sich sicher das Sie die Buchung stornieren möchten?')) {
      cancelBooking(data.id);
    }
  };

  booking.querySelector('#changeBooking').onclick = () => {
    document.querySelector('.changeDateModal').style.display = 'block';
  };

  document.querySelector('#closeModal').onclick = () => {
    document.querySelector('.changeDateModal').style.display = 'none';
  };

  document.querySelector('#changeDates').onclick = () => {
    if (window.confirm('Sind Sie sich sicher das Sie die Daten ändern möchten?')) {
      changeDates(data.id);
    }
  };

  document.querySelector('#newArrivalDate').min = new Date().toISOString().split('T')[0];
  document.querySelector('#newDepartureDate').min = new Date().toISOString().split('T')[0];

  document.querySelector('#bookingContainer').innerHTML = '';
  document.querySelector('#bookingContainer').appendChild(booking);
}

function cancelBooking (id) {
  const request = new XMLHttpRequest();

  request.addEventListener('load', () => {
    if (request.status === 200) {
      window.alert('Die Buchung wurde erfolgreich storniert.');
      document.querySelector('#bookingContainer').innerHTML = '';
    }
  });

  request.open('DELETE', '/order/' + id);
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
}

function changeDates (id) {
  const request = new XMLHttpRequest();

  request.addEventListener('load', () => {
    if (request.status === 200) {
      document.querySelector('.changeDateModal').style.display = 'none';
      document.querySelector('#bookingContainer').innerHTML = '';
      document.getElementById('bookingNumber').value = id;
      window.alert('Die Daten wurden erfolgreich geändert.');
    }
  });

  request.open('POST', '/order/dates', true);
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('Content-Type', 'application/json');
  const data = {
    id: id,
    arrival: document.querySelector('#newArrivalDate').value,
    departure: document.querySelector('#newDepartureDate').value
  };
  request.send(JSON.stringify(data));
}
