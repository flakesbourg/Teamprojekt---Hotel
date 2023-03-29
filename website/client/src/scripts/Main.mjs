import { moveMenu, burgerMenu, bookingInput, bookingForm, checkForm } from './Header.mjs';
import { cardImage } from './Homepage.mjs';
import $ from 'jquery';
import { ImagesModal } from './zimmerDetails.mjs';
import { bookingDialog } from './Booking.mjs';
import { weather } from './Weather.mjs';
import { myBooking } from './MyBooking.mjs';
import { kontaktDaten } from './KontaktDaten.mjs';
import { requestMeetingRoom } from './Meeting.mjs';
import { basicThreeD, familyThreeD, premiumThreeD } from './threeD.mjs';

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
    case 'Tagungsräume':
      $('#logo').replaceWith('<h1 id="headline">Tagungsräume</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageHalls');
      break;
    case 'Tagen und Feiern':
      $('#logo').replaceWith('<h1 id="headline">Tagen und Feiern</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageMeeting');
      break;
    case 'Kontakt':
      $('#logo').replaceWith('<h1 id="headline">Kontakt</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageContact');
      break;
    case 'Karriere':
      $('#logo').replaceWith('<h1 id="headline">Karriere</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageCareer');
      break;
    case 'Fitness':
      $('#logo').replaceWith('<h1 id="headline">Fitness</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageFitness');
      break;
    case 'Restaurant':
      $('#logo').replaceWith('<h1 id="headline">Restaurant</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageRestaurant');
      break;
    case 'Wellness':
      $('#logo').replaceWith('<h1 id="headline">Wellness</h1>');
      document.getElementsByClassName('heroImageHomepage')[0].classList.add('heroImageWellness');
      break;
  }
});
$('footer').load('footer.html #footer');

if (document.title === 'Grandline Hotel' || document.title === 'Aktivitäten' || document.title === 'Tagen und Feiern' || document.title === 'Tagungsräume' || document.title === 'Fitness' || document.title === 'Restaurant' || document.title === 'Wellness') {
  cardImage();
}
if (document.title === 'Zimmer - Basic' || document.title === 'Zimmer - Family' || document.title === 'Zimmer - Premium') {
  ImagesModal();
}
if (document.title === 'Buchen') {
  bookingDialog();
}
if (document.title === 'Grandline Hotel') {
  weather();
}
if (document.title === 'Meine Buchung') {
  myBooking();
}
if (document.title === 'Kontakt') {
  kontaktDaten();
}
if (document.title === 'Anfragen') {
  requestMeetingRoom();
}
if (document.title === 'Basic-ThreeD') {
  basicThreeD();
}
if (document.title === 'Family-ThreeD') {
  familyThreeD();
}
if (document.title === 'Premium-ThreeD') {
  premiumThreeD();
}
