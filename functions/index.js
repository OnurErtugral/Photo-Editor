var nodemailer = require("nodemailer");
const functions = require("firebase-functions");
require("dotenv").config();

var transporter = nodemailer.createTransport(
    `smtps://${process.env.SENDER_EMAIL}:${
        process.env.SENDER_PASSWORD
    }@smtp.gmail.com`
);

exports.sendMail = functions.https.onCall(async (data, context) => {
    console.log("inside functions.https.onCall");

    const output = `
    <p>Edited version of ${data.fileName} is in the attechment.</p>
    <ul>  
      <li>Name: ${data.fileName}</li>
    </ul>
  `;
    var mailOptions = {
        from: `Photo Editor <${process.env.SENDER_EMAIL}>`,
        to: `${data.email}`,
        subject: "Edited Version of Your Image",
        attachments: [
            {
                filename: data.fileName,
                content: data.content,
                encoding: "base64"
            }
        ],
        html: output
    };
    await transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.log("error: " + err);
            return { payload: err };
        } else {
            console.log("Email has been sent!");
            return { payload: response };
        }
    });
});
