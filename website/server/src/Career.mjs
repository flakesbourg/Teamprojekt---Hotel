import express from 'express';
import formidable from 'formidable';
import path from 'path';
import { __dirname } from '../../server.mjs';
import fs from 'fs';
import { emailData } from '../../secrets/emailData.mjs';
import nodemailer from 'nodemailer';

const server = new express.Router();

server.use(express.urlencoded());
server.use(express.json());

const isFileValid = (file) => {
  const type = file.mimetype.split('/').pop();
  const validTypes = ['jpg', 'jpeg', 'png', 'pdf'];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

server.post('/career', function (req, res) {
  const form = new formidable.IncomingForm();
  const uploadFolder = path.join(__dirname, 'public', 'files');

  form.multiples = true;
  form.maxFileSize = 100 * 1024 * 1024; // 5MB
  form.uploadDir = uploadFolder;

  const attachments = [];

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log('Error parsing the files');
      return res.status(400).json({
        status: 'Fail',
        message: 'There was an error parsing the files',
        error: err
      });
    }

    const json = JSON.parse(JSON.stringify(files));

    const key = Object.keys(json);

    for (let i = 0; i < key.length; i++) {
      if (json[key[i]].size === 0) {
        fs.unlinkSync(json[key[i]].filepath);
      } else {
        const file = json[key[i]];
        const isValid = isFileValid(file);
        const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, '-'));

        if (!isValid) {
          return res.status(400).json({
            status: 'Fail',
            message: 'The file type is not a valid type'
          });
        }

        try {
          fs.renameSync(file.filepath, path.join(uploadFolder, fileName));
          attachments.push({ filename: fileName, path: path.join(uploadFolder, fileName) });
        } catch (error) {
          console.log(error);
          res.sendStatus(400);
        }
      }
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailData.user,
        pass: emailData.pass
      }
    });

    const mailOptions = {
      from: emailData.user,
      to: 'grandlinehotelvulkan@gmail.com',
      subject: 'Bewerbung',
      html: '<h1>Eine Bewerbung von ' + fields.fname + ' ' + fields.lname + ` wurde versandt</h1>
      <h3>Email: ` + fields.email + ',  Telefon: ' + fields.phone + `</h3>
      <h3>Anmerkung: ` + fields.message,
      attachments: attachments
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email wurde gesendet: ' + info.response);
      }
    });

    try {
      return res.status(200).redirect('/karriere.html');
    } catch (error) {
      console.log(error);
    }
  });
});

export { server as careerRouter };
