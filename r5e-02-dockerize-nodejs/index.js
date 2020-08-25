const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express(); //new exxpress app web server

const fileServerMiddleware = express.static('public');//A middleware, to return a looking static file base on reqs

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use('/',fileServerMiddleware);//Mount the middleware for this app.

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

app.get('/ping', function(req, res) {
    res.send('pong');
});

// CURD
app.get('/api/me', function(req, res) {
    res.send('this is fake api');
});

app.get('/api/users', (req, res) => {
    return res.send('GET HTTP method on user resource');
});

app.post('/api/users', (req, res) => {
    return res.send('POST HTTP method on user resource');
});

app.put('/api/users/:userId', (req, res) => {
    return res.send(
        `PUT HTTP method on user/${req.params.userId} resource`,
    );
});

app.delete('/api/users/:userId', (req, res) => {
    return res.send(
        `DELETE HTTP method on user/${req.params.userId} resource`,
    );
});

// Upload
app.post('/api/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
            console.log('0', req.files);
        } else {
            console.log('1', req.files);
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./public/uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];
                
                //move photo to uploads directory
                photo.mv('./public/uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});