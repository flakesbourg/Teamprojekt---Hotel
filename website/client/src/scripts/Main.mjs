import { moveMenu, burgerMenu, bookingInput } from './Header.mjs';
import $ from 'jquery';

$('header').load('header.html header', function () {
  moveMenu();
  burgerMenu();
  bookingInput();
});
$('footer').load('footer.html footer');
