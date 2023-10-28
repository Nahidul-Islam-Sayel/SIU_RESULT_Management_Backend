const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const SingUpHanderler = require('./RouteHandler/SingUpHandeler');
const CseDepartmentHandler = require('./RouteHandler/CseDepartmentHandler');
const TeachersHandler = require('./RouteHandler/TeachersHandler');
const ControlerHandler = require('./RouteHandler/ControlerHandler');
var cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 5000||process.env.PORT;

// Access the DATABASE variable after loading the environment variables
const DATABASE = process.env.DATABASE;

// Database connection

mongoose
  .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection successful');
  })
  .catch((err) => console.log(err));

// ...rest of your code

app.use(express.json());
app.use(cors()) 
app.use('/Singup',SingUpHanderler)
app.use('/LoginDepartmentCSE', CseDepartmentHandler );
app.use('/Teachers', TeachersHandler );
app.use('/Controler', ControlerHandler );

app.use(express.static('Uploads'))
app.use(fileUpload);
// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})