import XMLHttpRequest from 'xhr2';

export function kontaktDaten () {
  const contactForm = document.querySelector('#myForm');
  const anrede = document.getElementById('anrede');
  const fname = document.getElementById('fname');
  const lname = document.getElementById('lname');
  const email = document.getElementById('email');
  const phonenr = document.getElementById('phonenr');
  const message = document.getElementById('message');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      anrede: anrede.value,
      fname: fname.value,
      lname: lname.value,
      email: email.value,
      phonenr: phonenr.value,
      message: message.value
    };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function () {
      console.log(xhr.responseText);
      if (xhr.responseText === 'success') {
        window.alert('Ihre Email wurde erfolgreich versendet');
        anrede.value = '';
        fname.value = '';
        lname.value = '';
        email.value = '';
        phonenr.value = '';
        message.value = '';
      } else {
        window.alert('Ein Fehler ist aufgetreten');
      }
    };
    xhr.send(JSON.stringify(formData));
  });
}
