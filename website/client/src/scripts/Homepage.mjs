export function cardImage () {
  window.addEventListener('resize', resizeCardImage);

  const images = document.getElementsByClassName('cardImage');
  for (let i = 0; i < images.length; i++) {
    images[i].onload = function () {
      resizeCardImage();
    };
  }

  function resizeCardImage () {
    if (window.innerWidth >= 900) {
      for (let i = 0; i < images.length; i++) {
        images[i].style.height = Math.floor(images[i].parentElement.offsetHeight * 0.7) + 'px';
      }
    } else {
      for (let i = 0; i < images.length; i++) {
        images[i].style.height = 'auto';
      }
    }
  }
}
