const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: "adisonstocks@gmail.com",
        password: "wktngveyxekompna",
      },
})

async function sendMail(to, sub,msg){
 transporter.sendMail({
    to:to,
    subject: sub,
    html: msg
 });
 console.log("email sent");
 
}

sendMail('adisonstocks@gmail.com', "This is test subject", "This is test mail");