require('dotenv').config();

const express    = require('express');
const nodemailer = require('nodemailer');
const app        = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;


app.post('/send', async(req, res) => {
    const { name, email, message } = req.body;

    const transport = nodemailer.createTransport({
        service: 'gmail',
        port:     465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    })

    const staffMessage = `You have a new message from ${name} (${email}): ${message}`;
    const staffMail = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_STAFF,
        subject: 'New message from portfolio',
        text: staffMessage
    };

    const userMessage = `Thank you for contacting us, ${name}! \n\n We will get back to you as soon as possible.`;
    const userMail = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us!',
        text: userMessage
    };

    try {
        const res = await transport.sendMail(staffMail);
        console.log('Staff email sent: ', res);
    } catch (error) {
        console.log('Error sending staff email: ', error);
    }

    try {
        const res = await transport.sendMail(userMail);
        console.log('User email sent: ', res);
    } catch (error) {
        console.log('Error sending user email: ', error);
    }

    return res.status(200).json({ message: 'Email sent!' });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})