import XMLHttpRequest from 'xhr2';

export function bookingDialog () {
  const backToPrevious = document.getElementsByClassName('backToPreviousSite')[0];
  backToPrevious.onclick = () => {
    window.history.back();
  };

  let request;
  const dialog = document.getElementsByClassName('bookingDialog')[0];
  const dialogBack = document.getElementsByClassName('dialogBack')[0];
  const dialogForward = document.getElementsByClassName('dialogForward')[0];
  const dialogProgress = document.getElementsByClassName('dialogProgress')[0];
  let currentStep = 1;

  dialogForward.onclick = () => {
    if (currentStep === 1) {
      readInputStepOne();
      if (checkInputStepOne()) {
        loadStepTwo();
      } else {
        loadStepOne();
      }
    }
  };

  dialogBack.onclick = () => {
    if (currentStep === 2) {
      loadStepOne();
    }
  };

  let arrival = new Date();
  let departure = new Date();
  let adults = 0;
  let children = 0;
  let rooms = 0;

  // Variables for step one
  let stepOne = document.querySelector('#one').content.cloneNode(true);
  let arrivalDialog = stepOne.querySelector('#arrivalDialog');
  let departureDialog = stepOne.querySelector('#departureDialog');
  let adultsDialog = stepOne.querySelector('#adultsDialog');
  let childrenDialog = stepOne.querySelector('#childrenDialog');
  let roomsDialog = stepOne.querySelector('#roomsDialog');

  window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('arrival') !== null) {
      arrival = new Date(params.get('arrival'));
    }
    if (params.get('departure') !== null) {
      departure = new Date(params.get('departure'));
    }
    if (params.get('adults') !== null) {
      adults = Number(params.get('adults'));
    }
    if (params.get('children') !== null) {
      children = Number(params.get('children'));
    }
    if (params.get('rooms') !== null) {
      rooms = Number(params.get('rooms'));
    }

    if (checkInputStepOne()) {
      loadStepTwo();
    } else {
      loadStepOne();
    }
  });

  function loadStepOne () {
    currentStep = 1;
    dialogProgress.innerHTML = '1 / 3';

    dialog.innerHTML = '';
    stepOne = document.querySelector('#one').content.cloneNode(true);
    arrivalDialog = stepOne.querySelector('#arrivalDialog');
    departureDialog = stepOne.querySelector('#departureDialog');
    adultsDialog = stepOne.querySelector('#adultsDialog');
    childrenDialog = stepOne.querySelector('#childrenDialog');
    roomsDialog = stepOne.querySelector('#roomsDialog');

    arrivalDialog.value = arrival.toISOString().substring(0, 10);
    departureDialog.value = departure.toISOString().substring(0, 10);
    adultsDialog.value = adults;
    childrenDialog.value = children;
    roomsDialog.value = rooms;

    dialog.appendChild(stepOne);
  }

  function checkInputStepOne () {
    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
      arrival = new Date(Date.now());
      departure = new Date(Date.now());
      return false;
    } else if (arrival < Date.now() || arrival > departure) {
      departure = new Date(Date.now());
      arrival = new Date(Date.now());
      window.alert('Ankuft kann nicht vor der Abreise oder in der Vergangenheit liegen');
      return false;
    } else if (rooms < 0 || adults < 0 || children < 0 || rooms === 0 || adults === 0) {
      rooms = 0;
      adults = 0;
      children = 0;
      window.alert('Erwachsenen und Zimmer können nicht kleiner/gleich null sein');
      return false;
    } else if (rooms > 4 || adults > rooms * 2 || children > rooms * 2) {
      rooms = 0;
      adults = 0;
      children = 0;
      window.alert('Pro Zimmer können nur 2 Erwachsenen und 2 Kinder gebucht werden');
      return false;
    }

    return true;
  }

  function readInputStepOne () {
    arrival = new Date(arrivalDialog.value);
    departure = new Date(departureDialog.value);
    adults = Number(adultsDialog.value);
    children = Number(childrenDialog.value);
    rooms = Number(roomsDialog.value);
  }

  function loadStepTwo () {
    currentStep = 2;
    dialogProgress.innerHTML = '2 / 3';

    dialog.innerHTML = '';
    getAvailableRooms();
  }

  function getAvailableRooms () {
    if (!checkInputStepOne()) {
      return;
    }
    request = new XMLHttpRequest();

    request.addEventListener('load', () => {
      if (request.status === 200) {
        showRooms(request.response);
      } else if (request.status === 204) {
        console.log(204);
      }
    });

    request.open('GET', '/getAvailableRooms?arrival=' + arrival.toISOString().substring(0, 10) + '&departure=' + departure.toISOString().substring(0, 10));
    request.setRequestHeader('Accept', 'text/json');
    request.responseType = 'json';
    request.send();
  }

  function showRooms (data) {
    console.log(data);
    let basic = data.filter(item => item.roomType === 'basic').length;
    let family = data.filter(item => item.roomType === 'family').length;
    let premium = data.filter(item => item.roomType === 'premium').length;

    const stepTwo = document.querySelector('#two').content.cloneNode(true);
    if (basic > 0) {
      const addBasic = document.querySelector('#addBasic').content.cloneNode(true);
      addBasic.querySelector('.addAvailableButton').onclick = () => {
        if (basic > 0) {
          basic = basic - 1;
        } else {
          this.disabled = true;
        }
      };
      stepTwo.querySelector('.availableRooms').appendChild(addBasic);
    }

    if (family > 0) {
      const addFamily = document.querySelector('#addFamily').content.cloneNode(true);
      addFamily.querySelector('.addAvailableButton').onclick = () => {
        if (family > 0) {
          family = family - 1;
        } else {
          this.disabled = true;
        }
      };
      stepTwo.querySelector('.availableRooms').appendChild(addFamily);
    }

    if (premium > 0) {
      const addPremium = document.querySelector('#addPremium').content.cloneNode(true);
      addPremium.querySelector('.addAvailableButton').onclick = () => {
        if (premium > 0) {
          premium = premium - 1;
        } else {
          this.disabled = true;
        }
      };
      stepTwo.querySelector('.availableRooms').appendChild(addPremium);
    }

    dialog.appendChild(stepTwo);
  }
}
