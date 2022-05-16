require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const fs = require('fs');
const util = require('util')
const unlinkfile = util.promisify(fs.unlink)

app.set('view engine', 'pug');
app.use(cors({optionsSuccessStatus: 200}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const {uploadFile} = require('./s3')

const storage = multer.diskStorage({
  destination: "./uploads/",

  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage })

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', upload.array('test', 10) , async ( req, res) => {
  var promises = []
  for (var i = 0; i < req.files.length; i++) {
    const data = await uploadFile(req.files[i]);
    await unlinkfile(req.files[i].path)

    // ADD MONGO DB HERE FOR LINKING.
  }
  res.redirect('/') 
})


app.listen(3000, () => {
  console.log("listening at 3000")
})