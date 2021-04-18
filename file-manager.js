//try to print

const express = require('express');
const app= express();
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();
const multer = require('multer');
const uuid = require('uuid').v4;
const fs = require('fs');
const http = require('http');
const path = require("path");
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'public'));












//nodemon server-upload.js
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null,'uploads');
    },
    filename:(req,file,cb) =>{
        const { originalname } = file;
        cb(null,`${uuid()}-${originalname}`);
    }
})
const upload = multer({storage});

app.use(express.static('public'));

app.post('/upload',upload.single('avatar'),(req,res) => {

   return res.json({ status: "The file was uploaded", });
    });




//get most recent updated file
function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

if(isEmpty('uploads/')){
    app.get('/',function(req,res) {
        return res.render('index', {
            latestfile: 'There is no file',
            latesttime: 'There is no file'
        });
    });

}else {
    const getMostRecentFile = (dir) => {
        const files = orderReccentFiles(dir);
        return files.length ? files[0] :0;
    };
    const orderReccentFiles = (dir) => {
        return fs.readdirSync(dir)
            .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
            .map((file) => ({file, mtime: fs.lstatSync(path.join(dir, file)).mtime}))
            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    };


    console.log(getMostRecentFile('uploads/'));

    app.get('/', function (req, res) {
        return res.render('index', {
            latestfile: getMostRecentFile('uploads/').file,
            latesttime: getMostRecentFile('uploads/').mtime

        });
    });


}


//delete file
 app.post('/delete_file', function(req,res){
     var { textRemove } = req.body.textRemove;






fs.stat('uploads/'+textRemove, function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable

        if (err) {
            return console.error(err);
        }

        fs.unlink('uploads/'+textRemove,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
        });
    });

 });




 //find and replace file
app.post('/replace_file', function(req,res){
    var { textNew } = req.body.textNew;
    var { textOld } = req.body.textOld;
    var { textFile } = req.body.textFile;


    var glob = require('glob');

var replace = require('replace');

// Find file(s)
glob(textFile, function(err, files) {
    if (err) { throw err; }
    files.forEach(function(item, index, array) {
        console.log(item + ' found');
        // Read file
        console.log(fs.readFileSync(item, 'utf8'));
        // Find and Replace string
        replace({
            regex: textOld,
            replacement: textNew,
            paths: [item],
            recursive: true,
            silent: true
        });
        console.log('Replacement complete');
        // Read file
        console.log(fs.readFileSync(item, 'utf8'));
    });
});
});

app.listen(3001, () => console.log('File manager active and running....'));

