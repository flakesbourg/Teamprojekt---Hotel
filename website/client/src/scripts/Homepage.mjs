export function cardImage () {
  window.addEventListener('resize', resizeCardImage);

  const images = document.getElementsByClassName('cardImage');

  window.addEventListener('load', () => {
    resizeCardImage();
  });

  function resizeCardImage () {
    if (window.innerWidth >= 900) {
      for (let i = 0; i < images.length; i++) {
        images[i].style.height = Math.floor(images[i].parentElement.querySelector('.cardText').offsetHeight * 0.9) + 'px';
      }
    } else {
      for (let i = 0; i < images.length; i++) {
        images[i].style.height = 'auto';
      }
    }
  }
}
