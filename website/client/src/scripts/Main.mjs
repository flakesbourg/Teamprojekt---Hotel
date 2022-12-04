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
});
$('footer').load('footer.html #footer');

if (document.title === 'Grandline Hotel') {
  cardImage();
}
