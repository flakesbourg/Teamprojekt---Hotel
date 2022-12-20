import $ from 'jQuery';

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

  function toggleSticky () {
    if (window.pageYOffset > sticky) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }

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

export function bookingInput () {
  const booking = document.getElementById('bookingInput');
  const bookingButton = document.getElementsByClassName('bookingButton')[0];
  const navbar = document.getElementById('navbar');
  const roomSelection = document.getElementsByClassName('roomSelection')[0];
  setTop();

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

export function bookingForm () {
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

  const addRoom = document.getElementById('addRoom');
  addRoom.addEventListener('click', () => {
    const newRoom = $('#roomTemplate').children().clone().get(0);

    // Button zum entfernen des Zimmers
    const deleteButton = newRoom.querySelector('.deleteRoom');
    deleteButton.onclick = () => {
      newRoom.remove();
    };

    // Auswahl der Menge von Erwachsenen
    const adultMinus = newRoom.querySelector('.adultsValue .minusButton');
    const adultPlus = newRoom.querySelector('.adultsValue .plusButton');
    const adultValue = newRoom.querySelector('.adultsValue .value');

    adultMinus.onclick = () => {
      const value = Number(adultValue.innerHTML);
      if (value > 0) {
        adultValue.innerHTML = value - 1;
      } else {
        adultValue.innerHTML = 0;
      }
    };

    adultPlus.onclick = () => {
      const value = Number(adultValue.innerHTML);
      adultValue.innerHTML = value + 1;
    };

    // Auswahl der Menge der Kinder
    const childMinus = newRoom.querySelector('.childrenValue .minusButton');
    const childPlus = newRoom.querySelector('.childrenValue .plusButton');
    const childValue = newRoom.querySelector('.childrenValue .value');

    childMinus.onclick = () => {
      const value = Number(childValue.innerHTML);
      if (value > 0) {
        childValue.innerHTML = value - 1;
      } else {
        childValue.innerHTML = 0;
      }
    };

    childPlus.onclick = () => {
      const value = Number(childValue.innerHTML);
      childValue.innerHTML = value + 1;
    };

    $('#roomList').append(newRoom);
  });
}
