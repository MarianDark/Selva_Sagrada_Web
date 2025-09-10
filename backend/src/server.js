require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookie = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connect = require('./config/db');


const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookie());
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }));


app.get('/api/health', (_,res)=>res.json({status:'ok'}));


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/availability', require('./routes/availability.routes'));
app.use('/api/bookings', require('./routes/bookings.routes'));
app.use('/api/contact', require('./routes/contact.routes'));


app.use(require('./middleware/error'));


connect().then(()=>{
app.listen(process.env.PORT, ()=>
console.log(`API on :${process.env.PORT}`)
);
});