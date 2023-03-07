// import emailjs from '@emailjs/browser';
// export function sendMail () {
//   const params = {
//     name: document.getElementById('name').value,
//     email: document.getElementById('email').value,
//     message: document.getElementById('message').value

//   };

//   const serviceID = 'service_qm46iw8';
//   const templateID = 'template_0lmws5a';
//   const publicKey = 'BqkjrVvH5LUPvUXwn';

//   emailjs.sendForm(serviceID, templateID, params, publicKey)
//     .then(
//       res => {
//         document.getElementById('name').value = '';
//         document.getElementById('email').value = '';
//         document.getElementById('message').value = '';
//         console.log(res);
//         window.alert('message send!');
//       }
//     )
//     .catch((err) => console.log(err));
// }
