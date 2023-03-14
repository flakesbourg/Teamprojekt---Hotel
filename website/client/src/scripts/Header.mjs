// Funktion damit die navbar kleben bleibt
export function moveMenu () {
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);

  const header = document.getElementById('navbar');
  let sticky = header.offsetTop;

  function onScroll () {
    toggleSticky();
    changeOpacity();
  }

  function onResize () {
    sticky = Math.round(window.innerHeight * 0.8);
    onScroll();
  }

  // navabar wird kleben wenn weit genug gescrollt wird
  function toggleSticky () {
    if (window.pageYOffset > sticky) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }

  // opacity des backgrounds wird je nach scrolling fortschritt angepasst
  function changeOpacity () {
    if (window.pageYOffset < sticky) {
      header.style.background = 'none';
      header.style.boxShadow = 'none';
    } else if (window.pageYOffset > sticky && window.pageYOffset <= window.innerHeight) {
      header.style.background = 'rgba(45, 45, 48,' + ((window.pageYOffset - sticky) / (window.innerHeight - sticky)) + ')';
      header.style.boxShadow = 'none';
    } else {
      header.style.background = 'rgba(45, 45, 48, 1)';
      header.style.boxShadow = '0px 5px 15px black';
    }
  }
}

export function burgerMenu () {
  const burgerIcon = document.getElementById('burgerIcon');
  const closeIcon = document.getElementById('closeIcon');
  const burgerMenu = document.getElementById('burgerMenu');
  const background = document.getElementById('opaqueBackground');

  burgerIcon.addEventListener('click', () => {
    burgerMenu.classList.add('open');
    background.style.display = 'block';
  });

  closeIcon.addEventListener('click', () => {
    burgerMenu.classList.remove('open');
    background.style.display = 'none';
  });

  window.addEventListener('resize', () => {
    if (window.getComputedStyle(burgerIcon, null).getPropertyValue('display') === 'none') {
      burgerMenu.classList.remove('open');
      background.style.display = 'none';
    }
  });
}

// Öffnen und Schließen des Buchungs Formulars
export function bookingInput () {
  const booking = document.getElementById('bookingInput');
  const bookingButton = document.getElementsByClassName('bookingButton')[0];
  const navbar = document.getElementById('navbar');
  const roomSelection = document.getElementsByClassName('roomSelection')[0];
  setTop();

  // 'verstecken' des formulars wenn die seite verändert wird
  window.addEventListener('resize', () => {
    if (window.getComputedStyle(booking).top !== navbar.offsetHeight + 'px') {
      setTop();
    }
  });

  window.addEventListener('scroll', () => {
    if (window.pageYOffset < window.innerHeight) {
      setTop();
    }
  });

  // öffnen und schließen des formulars
  bookingButton.onclick = async function () {
    if (window.pageYOffset < window.innerHeight) {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
      await delay(800);
    }
    if (window.getComputedStyle(booking).top === '' + navbar.offsetHeight + 'px') {
      setTop();
    } else {
      booking.style.top = navbar.offsetHeight + 'px';
    }
  };

  // Funktion zum 'verstecken' des formulars
  function setTop () {
    const bookingHeight = booking.offsetHeight;
    booking.style.top = '-' + (10 + bookingHeight) + 'px';
    roomSelection.style.display = 'none';
  }

  function delay (milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }
}

// Funktion für alle Funktionalitäten der Zimmerauswahl
export function bookingForm () {
  // An-/Abreisetag begrenzen
  const arrivalInput = document.getElementById('arrival');
  const departureInput = document.getElementById('departure');

  arrivalInput.min = new Date().toISOString().split('T')[0];
  departureInput.min = new Date().toISOString().split('T')[0];

  // Zimmerauswahl wird ein- und ausgeblendet
  const roomInput = document.getElementById('rooms');
  const roomSelection = document.getElementsByClassName('roomSelection')[0];
  const closeSelection = document.getElementsByClassName('closeSelection')[0];

  roomInput.addEventListener('click', () => {
    if (roomSelection.style.display === 'none') {
      roomSelection.style.display = 'flex';
    } else {
      roomSelection.style.display = 'none';
    }
  });

  closeSelection.addEventListener('click', () => {
    roomSelection.style.display = 'none';
  });

  const adults = document.getElementsByClassName('adults')[0];
  const adultsValue = document.getElementsByClassName('adults')[0].querySelector('.value');
  adults.querySelector('.minusButton').onclick = () => {
    const value = Number(adultsValue.innerHTML);
    if (value > 0) {
      adultsValue.innerHTML = value - 1;
      updateRoomInput();
    }
  };
  adults.querySelector('.plusButton').onclick = () => {
    const value = Number(adultsValue.innerHTML);
    if (value < Number(roomsValue.innerHTML) * 2) {
      adultsValue.innerHTML = value + 1;
      updateRoomInput();
    }
  };

  const children = document.getElementsByClassName('children')[0];
  const childrenValue = document.getElementsByClassName('children')[0].querySelector('.value');
  children.querySelector('.minusButton').onclick = () => {
    const value = Number(childrenValue.innerHTML);
    if (value > 0) {
      childrenValue.innerHTML = value - 1;
      updateRoomInput();
    }
  };
  children.querySelector('.plusButton').onclick = () => {
    const value = Number(childrenValue.innerHTML);
    if (value < Number(roomsValue.innerHTML) * 2) {
      childrenValue.innerHTML = value + 1;
      updateRoomInput();
    }
  };

  const rooms = document.getElementsByClassName('selectRooms')[0];
  const roomsValue = document.getElementsByClassName('selectRooms')[0].querySelector('.value');
  rooms.querySelector('.minusButton').onclick = () => {
    const value = Number(roomsValue.innerHTML);
    if (value > 0) {
      roomsValue.innerHTML = value - 1;
      if (Number(adultsValue.innerHTML) > Number(roomsValue.innerHTML) * 2) {
        adultsValue.innerHTML = Number(roomsValue.innerHTML) * 2;
      }
      if (Number(childrenValue.innerHTML) > Number(roomsValue.innerHTML) * 2) {
        childrenValue.innerHTML = Number(roomsValue.innerHTML) * 2;
      }
      updateRoomInput();
    }
  };
  rooms.querySelector('.plusButton').onclick = () => {
    const value = Number(roomsValue.innerHTML);
    if (value < 4) {
      roomsValue.innerHTML = value + 1;
      updateRoomInput();
    }
  };
  updateRoomInput();
}

// Funktion die den Inhalt des Text-Inputs anpasst wenn die Zimmerauswahl verändert wird
function updateRoomInput () {
  const roomInput = document.getElementById('rooms');
  const adultsValue = document.getElementsByClassName('adults')[0].querySelector('.value');
  const childrenValue = document.getElementsByClassName('children')[0].querySelector('.value');
  const roomsValue = document.getElementsByClassName('selectRooms')[0].querySelector('.value');
  roomInput.value = '';

  roomInput.value = 'E:' + adultsValue.innerHTML + '//K:' + childrenValue.innerHTML + '//Z:' + roomsValue.innerHTML;
}

export function checkForm () {
  const arrivalInput = document.getElementById('arrival');
  const departureInput = document.getElementById('departure');
  const submit = document.getElementById('submitButton');

  submit.onclick = () => {
    const arrival = new Date(arrivalInput.value);
    const departure = new Date(departureInput.value);
    const adultsValue = Number(document.getElementsByClassName('adults')[0].querySelector('.value').innerHTML);
    const childrenValue = Number(document.getElementsByClassName('children')[0].querySelector('.value').innerHTML);
    const roomsValue = Number(document.getElementsByClassName('selectRooms')[0].querySelector('.value').innerHTML);

    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
      window.alert('Ankunft- und Abreiseteg müssen angegeben werden');
    } else if (arrival < Date.now() || arrival > departure) {
      window.alert('Ankunftstag kann nicht in der Vergangenheit oder vor dem Abreisetag liegen!');
    } else if (roomsValue === 0 || adultsValue === 0) {
      window.alert('Die Anzahl der Erwachsenen und Zimmer darf nicht 0 sein!');
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('arrival', arrivalInput.value);
      searchParams.set('departure', departureInput.value);
      searchParams.set('adults', adultsValue);
      searchParams.set('children', childrenValue);
      searchParams.set('rooms', roomsValue);

      const newPath = '/booking.html?' + searchParams.toString();
      window.location = newPath;
    }
  };
}
