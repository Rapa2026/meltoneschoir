require('dotenv').config();
console.log('ENV CHECK:', process.env.EMAIL_USER,process.env.EMAIL_PASS ? 'PASS SET' : 'PASS MISSING');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT ||3000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname)));
app.use(express.json());

const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 587,
secure: false,
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
tls: {
rejectUnauthorized: false
}  
});  
app.get('/', (req, res) => {   
res.sendFile(path.join(__dirname, 'index.html'));
}); 
app.post('/enquire', async (req, res) => {
const { name, email, message } = req.body;
console.log('Form data received:', name, email, message);

try {
const info = await transporter.sendMail({
from: process.env.EMAIL_USER,
to: process.env.TO_EMAIL,
subject: `New Enquiry from ${name}`,
text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
});
console.log('Email sent:', info.response); 
res.json({ success: true, message: 'Thanks! We got it'});
} catch (err) {
console.error('Email failed:', err);
res.status(500).json({ success: false, message: 'Email failed'});
}
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
