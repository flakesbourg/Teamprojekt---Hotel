import express from 'express';
import nodemailer from 'nodemailer';
import { emailData } from '../../secrets/emailData.mjs';
const app = express.Router();

app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailData.user,
      pass: emailData.pass
    }
  });
  const mailOption = {
    from: req.body.email,
    to: 'testprojekt.023@gmail.com',
    subject: `Message from ${req.body.email}`,
    html: '<p> vorname :  ' + req.body.fname + `</p>  nachricht:` + req.body.message

  };
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
      res.send('error');
    } else {
      console.log('email was sent!!');
      res.send('success');
    }
  });
});
export { app as kontaktRouter };