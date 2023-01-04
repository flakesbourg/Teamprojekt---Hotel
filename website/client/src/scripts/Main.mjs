import { moveMenu, burgerMenu, bookingInput, bookingForm, checkForm } from './Header.mjs';
import { cardImage } from './Homepage.mjs';
import $ from 'jquery';
import { ImagesModal } from './zimmerDetails.mjs';
import { bookingDialog } from './Booking.mjs';

$('header').load('header.html #header', function () {
  moveMenu();
  burgerMenu();
  bookingInput();
  bookingForm();
  checkForm();

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
    case 'Aktivitäten':
      $('#logo').replaceWith('<h1 id="headline">Aktivitäten</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageActivities');
      break;
    case 'Tagen und Feiern':
      $('#logo').replaceWith('<h1 id="headline">Tagen und Feiern</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageHalls');
      break;
    case 'Kontakt':
      $('#logo').replaceWith('<h1 id="headline">Kontakt</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageContact');
      break;
    case 'Karriere':
      $('#logo').replaceWith('<h1 id="headline">Karriere</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageCareer');
      break;
  }
});
$('footer').load('footer.html #footer');

if (document.title === 'Grandline Hotel' || document.title === 'Aktivitäten' || document.title === 'Tagen und Feiern') {
  cardImage();
}
if (document.title === 'Zimmer - Basic' || document.title === 'Zimmer - Family' || document.title === 'Zimmer - Premium') {
  ImagesModal();
}
if (document.title === 'Buchen') {
  bookingDialog();
}
