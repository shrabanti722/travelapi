const path = require('path');

const express = require("express");
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const multer = require ('multer');

const feedRoutes = require('./routes/feed');
const app = express();

const fileStorage = multer.diskStorage({
      destination: (req, file, cb)=> {
            cb(null, 'images');
      },
      filename: (req, file, cb) => {
          cb(null, new Date().toISOString() + '-' + file.originalname);
      }
});

const fileFilter = (req, file, cb)=> {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname, "images")));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
});

const uri = 'mongodb+srv://shrabanti72:kzF6eR1UKsPMV0HI@cluster0.gmbpo.mongodb.net/restful_feed_app?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true}
);
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
  }).catch(err=>console.log(err));

  app.listen(8080, () => {
    console.log("Server is running on port: "+8080);
});

/*  
mongoose.connect('mongodb+srv://shrabanti72:kzF6eR1UKsPMV0HI@cluster0.gmbpo.mongodb.net/restful_feed_app?retryWrites=true&w=majority')
.then(result => {
    app.listen(8080, ()=>{
        console.log("Server is Running!!")
    });
})
.catch(err => console.log(err));
*/
