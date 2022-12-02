import { moveMenu, burgerMenu, bookingInput } from './Header.mjs';
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
