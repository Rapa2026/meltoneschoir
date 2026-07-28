require('dotenv').config();
console.log('ENV CHECK:', process.env.RESEND_API_KEY ? 'RESEND KEY SET : 'RESEND KEY MISSING');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT ||10000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/', (req, res) => {   
res.sendFile(path.join(__dirname, 'index.html'));
}); 

app.post('/enquire', async (req, res) => {
const { name, email, message } = req.body;
console.log('Form data received:', name, email, message);

try {
const { data, error } = await resend.emails.send({
from: 'Meltones Website <onboarding@resend.dev>',
to: ['themeltones2008@gmail.com'],
reply_to:email,
subject: `New Enquiry from ${name}`,
html: `<h3>New Contact Form</h3><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>,`
});

if (error) {
console.log("RESEND ERROR": error); 
return res.status(500).json({ error: "Email failed to send" });
}  
console.error("EMAIL SENT:", data.id);
res.status(200).json({ success: "Message sent!"'});
} catch (err) {
console.error("CATCH ERROR:", err);
return res.status(500).json({ error: "Something went wrong" });
});


