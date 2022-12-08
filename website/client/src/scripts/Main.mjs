import { moveMenu, burgerMenu, bookingInput } from './Header.mjs';
import { cardImage } from './Homepage.mjs';
import $ from 'jquery';

$('header').load('header.html #header', function () {
  moveMenu();
  burgerMenu();
  bookingInput();
  window.scrollTo({
    top: 0
  });

  const title = document.title;
  switch (title) {
    case 'Zimmer':
      $('#logo').replaceWith('<h1 id="headline">Zimmer</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageZimmer');
      break;
    case 'Zimmer - Basic':
      $('#logo').replaceWith('<h1 id="headline">Basic</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageBasic');
      break;
    case 'Zimmer - Family':
      $('#logo').replaceWith('<h1 id="headline">Family</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageFamily');
      break;
    case 'Zimmer - Premium':
      $('#logo').replaceWith('<h1 id="headline">Premium</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImagePremium');
      break;
  }
});
$('footer').load('footer.html #footer');

if (document.title === 'Grandline Hotel') {
  cardImage();
}
