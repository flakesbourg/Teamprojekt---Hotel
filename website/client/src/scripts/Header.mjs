export function moveMenu () {
  window.addEventListener('scroll', onScroll);
  window.addEventListener('scroll', onResize);

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
    } else if (window.pageYOffset > sticky && window.pageYOffset <= window.innerHeight) {
      header.style.background = 'rgba(45, 45, 48,' + ((window.pageYOffset - sticky) / (window.innerHeight - sticky)) + ')';
    } else {
      header.style.background = 'rgba(45, 45, 48, 1)';
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
  }

  function delay (milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }
}
