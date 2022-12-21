export function ImagesModal () {
  const images = document.querySelectorAll('.images img');
  const modal = document.querySelector('.modal');
  const modalImg = document.querySelector('.modalImg');
  const close = document.querySelector('.close');
  const prevBtn = document.querySelector('.prevBtn');
  const nextBtn = document.querySelector('.nextBtn');
  images.forEach((d, index) => {
    d.addEventListener('click', () => {
      modalImg.src = d.src;
      modal.setAttribute('id', 'appear');
      let imageIndex = index;
      let next = imageIndex++;
      let prev = imageIndex--;
      window.addEventListener('keyup', (e) => {
        if (next >= images.length) {
          next = 0;
        }
        if (prev < 0) {
          prev = images.length - 1;
        }
        if (e.keyCode === 37) {
          modalImg.src = images[prev].src;
          prev--;
          next = prev + 1;
        } else if (e.keyCode === 39) {
          modalImg.src = images[next].src;
          next++;
          prev = next - 1;
        } else if (e.keyCode === 27) {
          modal.removeAttribute('id', 'appear');
        }
      });
      prevBtn.addEventListener('click', () => {
        modalImg.src = images[prev].src;
        prev--;
        next = prev + 1;
        if (prev < 0) {
          prev = images.length - 1;
        }
      });
      nextBtn.addEventListener('click', () => {
        modalImg.src = images[next].src;
        next++;
        prev = next - 1;
        if (next >= images.length) {
          next = 0;
        }
      });
      close.addEventListener('click', () => {
        modal.removeAttribute('id', 'appear');
      });
    });
  });
}
