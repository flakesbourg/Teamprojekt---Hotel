import XMLHttpRequest from 'xhr2';

export function bookingDialog () {
  const backToPrevious = document.getElementsByClassName('backToPreviousSite')[0];
  backToPrevious.onclick = () => {
    window.location.href = '/';
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
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('arrival', arrival.toISOString().substring(0, 10));
        searchParams.set('departure', departure.toISOString().substring(0, 10));
        searchParams.set('adults', adults);
        searchParams.set('children', children);
        searchParams.set('rooms', rooms);

        const newPath = '/booking.html?' + searchParams.toString();
        window.history.pushState(null, '', newPath);

        dialogBack.disabled = false;
        dialogForward.disabled = true;
        loadStepTwo();
      } else {
        dialogBack.disabled = true;
        loadStepOne();
      }
    } else if (currentStep === 2 && checkInputStepTwo()) {
      loadStepThree();
    } else if (currentStep === 3 && readStepThree()) {
      dialogForward.innerHTML = 'Abschließen';
      loadStepFour();
    } else if (currentStep === 4) {
      completeOrder();
    }
  };

  dialogBack.onclick = () => {
    if (currentStep === 2) {
      dialogBack.disabled = true;
      dialogForward.disabled = false;
      loadStepOne();
    } else if (currentStep === 3) {
      dialogForward.disabled = true;
      loadStepTwo();
    } else if (currentStep === 4) {
      dialogForward.innerHTML = 'Weiter';
      loadStepThree();
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

  // Variables for step two
  const selectedRooms = new Map();
  selectedRooms.set('basic', 0);
  selectedRooms.set('family', 0);
  selectedRooms.set('premium', 0);

  // Variables for step three
  let gender;
  let firstName;
  let lastName;
  let email;
  let phone;
  let street;
  let houseNumber;
  let zipCode;
  let place;

  // lesen der queryParameter und laden des ersten oder zweiten schritts
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
      dialogForward.disabled = true;
      loadStepTwo();
    } else {
      dialogBack.disabled = true;
      loadStepOne();
    }
  });

  function loadStepOne () {
    currentStep = 1;
    dialogProgress.innerHTML = '1 / 4';

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
    dialogProgress.innerHTML = '2 / 4';

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
        notAvailable();
      }
    });

    request.open('GET', '/getAvailableRooms?arrival=' + arrival.toISOString().substring(0, 10) + '&departure=' + departure.toISOString().substring(0, 10));
    request.setRequestHeader('Accept', 'text/json');
    request.responseType = 'json';
    request.send();
  }

  function showRooms (data) {
    selectedRooms.set('basic', 0);
    selectedRooms.set('family', 0);
    selectedRooms.set('premium', 0);

    if (data.length < rooms) {
      notAvailable();
      return;
    }

    const stepTwo = document.querySelector('#two').content.cloneNode(true);

    let basic = data.filter(item => item.roomType === 'basic').length;
    let family = data.filter(item => item.roomType === 'family').length;
    let premium = data.filter(item => item.roomType === 'premium').length;

    // räume hinzufügen
    const addBasic = document.querySelector('#addBasic').content.cloneNode(true);
    addBasic.querySelector('.addAvailableButton').onclick = () => {
      if (basic > 0 && selectedRooms.get('basic') + selectedRooms.get('family') + selectedRooms.get('premium') < rooms) {
        basic = basic - 1;
        selectedRooms.set('basic', selectedRooms.get('basic') + 1);
        updateSelectedRooms();
      }

      if (selectedRooms.get('basic') + selectedRooms.get('family') + selectedRooms.get('premium') === rooms) {
        dialogForward.disabled = false;
      }

      if (basic === 0) {
        document.querySelector('.basicAvailable .addAvailableButton').disabled = true;
      }
    };
    if (basic === 0) {
      document.querySelector('.basicAvailable .addAvailableButton').disabled = true;
    }
    stepTwo.querySelector('.availableRooms').appendChild(addBasic);

    const addFamily = document.querySelector('#addFamily').content.cloneNode(true);
    addFamily.querySelector('.addAvailableButton').onclick = () => {
      if (family > 0 && selectedRooms.get('basic') + selectedRooms.get('family') + selectedRooms.get('premium') < rooms) {
        family = family - 1;
        selectedRooms.set('family', selectedRooms.get('family') + 1);
        updateSelectedRooms();
      }

      if (selectedRooms.get('basic') + selectedRooms.get('family') + selectedRooms.get('premium') === rooms) {
        dialogForward.disabled = false;
      }

      if (family === 0) {
        document.querySelector('.familyAvailable .addAvailableButton').disabled = true;
      }
    };
    if (family === 0) {
      document.querySelector('.basicAvailable .addAvailableButton').disabled = true;
    }
    stepTwo.querySelector('.availableRooms').appendChild(addFamily);

    const addPremium = document.querySelector('#addPremium').content.cloneNode(true);
    addPremium.querySelector('.addAvailableButton').onclick = () => {
      if (premium > 0 && selectedRooms.get('basic') + selectedRooms.get('family') + selectedRooms.get('premium') < rooms) {
        premium = premium - 1;
        selectedRooms.set('premium', selectedRooms.get('premium') + 1);
        updateSelectedRooms();
      }

      if (selectedRooms.get('basic') + selectedRooms.get('family') + selectedRooms.get('premium') === rooms) {
        dialogForward.disabled = false;
      }

      if (premium === 0) {
        document.querySelector('.premiumAvailable .addAvailableButton').disabled = true;
      }
    };
    if (premium === 0) {
      document.querySelector('.basicAvailable .addAvailableButton').disabled = true;
    }
    stepTwo.querySelector('.availableRooms').appendChild(addPremium);

    // delete buttons
    stepTwo.querySelector('.selectedBasic .delete').onclick = () => {
      if (selectedRooms.get('basic') > 0) {
        basic = basic + 1;
        selectedRooms.set('basic', selectedRooms.get('basic') - 1);
        document.querySelector('.basicAvailable .addAvailableButton').disabled = false;
        dialogForward.disabled = true;
        updateSelectedRooms();
      }
    };

    stepTwo.querySelector('.selectedFamily .delete').onclick = () => {
      if (selectedRooms.get('family') > 0) {
        family = family + 1;
        selectedRooms.set('family', selectedRooms.get('family') - 1);
        document.querySelector('.familyAvailable .addAvailableButton').disabled = false;
        dialogForward.disabled = true;
        updateSelectedRooms();
      }
    };

    stepTwo.querySelector('.selectedPremium .delete').onclick = () => {
      if (selectedRooms.get('premium') > 0) {
        premium = premium + 1;
        selectedRooms.set('premium', selectedRooms.get('premium') - 1);
        document.querySelector('.premiumAvailable .addAvailableButton').disabled = false;
        dialogForward.disabled = true;
        updateSelectedRooms();
      }
    };

    dialog.appendChild(stepTwo);
    updateSelectedRooms();
  }

  function notAvailable () {
    const elem = document.createElement('h3');
    elem.innerHTML = 'Zu wenige oder keine Zimmer verfügbar';
    elem.style.color = '#ff7b7a';
    elem.style.textAlign = 'center';
    elem.style.padding = '0 25px';
    dialog.appendChild(elem);
  }

  function updateSelectedRooms () {
    const selectedBasic = document.querySelector('.selectedBasic');
    if (selectedRooms.get('basic') === 0) {
      selectedBasic.style.display = 'none';
    } else {
      selectedBasic.style.display = 'flex';
      selectedBasic.querySelector('.amount').innerHTML = selectedRooms.get('basic') + ' x basic';
    }

    const selectedFamily = document.querySelector('.selectedFamily');
    if (selectedRooms.get('family') === 0) {
      selectedFamily.style.display = 'none';
    } else {
      selectedFamily.style.display = 'flex';
      selectedFamily.querySelector('.amount').innerHTML = selectedRooms.get('family') + ' x family';
    }

    const selectedPremium = document.querySelector('.selectedPremium');
    if (selectedRooms.get('premium') === 0) {
      selectedPremium.style.display = 'none';
    } else {
      selectedPremium.style.display = 'flex';
      selectedPremium.querySelector('.amount').innerHTML = selectedRooms.get('premium') + ' x premium';
    }
  }

  function checkInputStepTwo () {
    if (selectedRooms.get('basic') + selectedRooms.get('premium') + selectedRooms.get('family') === rooms) {
      return true;
    } else {
      return false;
    }
  }

  function loadStepThree () {
    currentStep = 3;
    dialogProgress.innerHTML = '3 / 4';

    dialog.innerHTML = '';
    const stepThree = document.querySelector('#three').content.cloneNode(true);
    dialog.appendChild(stepThree);
  }

  function readStepThree () {
    firstName = document.querySelector('#pFirstName').value;
    lastName = document.querySelector('#pLastName').value;
    gender = document.querySelector('#gender').value;
    email = document.querySelector('#pEmail').value;
    phone = document.querySelector('#pPhoneNumber').value;
    street = document.querySelector('#pStreet').value;
    houseNumber = document.querySelector('#pHouseNumber').value;
    zipCode = document.querySelector('#pZipCode').value;
    place = document.querySelector('#pPlace').value;

    if (firstName.trim() === '' || lastName.trim() === '' || street.trim() === '' || place.trim() === '') {
      window.alert('Bitte einen gültigen Vor-, Nachnamen oder eine gültige Straße angeben.');
      return false;
    }

    if (Number.isNaN(Number(phone)) || Number.isNaN(Number(zipCode)) || Number.isNaN(Number(houseNumber))) {
      window.alert('Bitte eine gültige Telefonnummber, Hausnummer oder PLZ angeben.');
      return false;
    }

    if (gender !== 'm' && gender !== 'w' && gender !== 'd') {
      window.alert('Bitte ein passendes Geschlecht wählen.');
      return false;
    }

    const re = /\S+@\S+\.\S/;
    if (!re.test(email)) {
      window.alert('Bitte eine gültige Email Adresse angeben.');
      return false;
    }

    return true;
  }

  function loadStepFour () {
    currentStep = 4;
    dialogProgress.innerHTML = '4 / 4';

    dialog.innerHTML = '';
    const stepFour = document.querySelector('#four').content.cloneNode(true);
    stepFour.querySelector('.personalDataName').innerHTML = firstName + ' ' + lastName;
    stepFour.querySelector('.personalDataAddress').innerHTML = street + ' ' + houseNumber + ', ' + zipCode + ' ' + place;
    stepFour.querySelector('.personalDataPhone').innerHTML = 'Telefon: ' + phone;
    stepFour.querySelector('.personalDataEmail').innerHTML = 'Email: ' + email;

    const totalBasic = document.createElement('p');
    totalBasic.innerHTML = selectedRooms.get('basic') + ' x basic';

    const totalFamily = document.createElement('p');
    totalFamily.innerHTML = selectedRooms.get('family') + ' x family';

    const totalPremium = document.createElement('p');
    totalPremium.innerHTML = selectedRooms.get('premium') + ' x premium';

    stepFour.querySelector('.totalSelectedRooms').appendChild(totalBasic);
    stepFour.querySelector('.totalSelectedRooms').appendChild(totalFamily);
    stepFour.querySelector('.totalSelectedRooms').appendChild(totalPremium);

    const total = selectedRooms.get('family') * 179 + selectedRooms.get('basic') * 149 + selectedRooms.get('premium') * 229;
    stepFour.querySelector('.total').innerHTML = 'Gesamtsumme: ' + total + '€';

    dialog.appendChild(stepFour);
  }

  function completeOrder () {
    request = new XMLHttpRequest();

    request.addEventListener('load', () => {
      if (request.status === 200) {
        showRooms(request.response);
      } else if (request.status === 204) {
        notAvailable();
      }
    });

    request.open('POST', '/order');
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.responseType = 'json';
    const data = {
      user: { firstName: firstName, lastName: lastName, gender: gender, email: email, address: { street: street, city: place, zipCode: zipCode, houseNumber: houseNumber } },
      reservations: { basic: selectedRooms.get('basic'), family: selectedRooms.get('family'), premium: selectedRooms.get('premium'), arrival: arrival, departure: departure }
    };
    request.send(JSON.stringify(data));
  }
}
