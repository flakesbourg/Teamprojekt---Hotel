export function moveMenu () {
  window.onscroll = function () {
    toggleSticky();
    changeOpacity();
  };

  window.onresize = function () {
    sticky = window.innerHeight * 0.8;
    toggleSticky();
    changeOpacity();
  };

  const header = document.getElementById('navbar');
  let sticky = header.offsetTop;

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

  window.onresize = () => {
    if (window.getComputedStyle(burgerIcon, null).getPropertyValue('display') === 'none') {
      burgerMenu.classList.remove('open');
      background.style.display = 'none';
    }
  };
}
