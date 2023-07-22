const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cors());
app.use('/api/v1/auth/', require('./routes/auth.js'));
app.use('/api/v1/user/', require('./routes/user.js'));
app.use(errorHandler);
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); //to display images in browser
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});