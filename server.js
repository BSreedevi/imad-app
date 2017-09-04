var express = require('express');
var morgan = require('morgan');
var path = require('path'); 
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var artcles= {
    'article-one':{
        title: 'Article One',
        heading: 'Article One',
        date: 'Aug 9 2017',
        content:
            "<p> this the content this the content            </p>"
    },
    'article-two': {
        title: 'Article Two',
        heading: 'Article Two',
        date: 'Aug 9 2017',
        content:
            "<p> this the content this the content            </p>"
    },
    'article-three': {
        title: 'Article Three',
        heading: 'Article Three',
        date: 'Aug 9 2017',
        content:
            "<p> this the content this the content  </p>"
    }
};
var config = {
    user: 'sreedeviharigopal',
    port: '5432',
    password: process.env.DB_PASSWORD,
    database:	'sreedeviharigopal',
    host: 'db.imad.hasura-app.io'
};
function createTemplate(data)
{
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
var htmlTemplate = 
'<html> ' +
 '   <head> ' +
  '      <title> ' +
            title +
    '    </title> ' +
     '   <meta name= "viewport" content = "width= device-width, intial-scale=1"/> ' +
     '    <link href="/ui/style.css" rel="stylesheet" /> ' +
     '</head>' +
     '<body>' +
       '  <div class = "container">' +
         '    <div>' +
           '      <a href="/" >Home</a>' +
             '</div>' +
             '<h1>' +
               heading +
             '</h1>' +
             '<div>' +
                 date +
             '</div>' +
             '<div>' +
               content +
             '</div>' +
         '</div>' +
     '</body>' +
 '</html> ' ;

return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
function hash(input, salt)
{
    // Create a hash
    var hashed = crypto.pbkdf2Sync(input, salt, 1000, 512, 'sha512');
    return ["pbkdf2" ,"1000", salt, hashed.toString('hex')].join("$");
}

app.get('/hash/:input', function (req, res) {
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
  res.send(hashedString);
});

var pool = new Pool(config);

app.post('/create-user', function (req, res) {
    
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1,$2)',[username, dbString], function(err,result){
        if(err){
                res.status(500).send(err.toString())}
        else
        {
            //res.send(JSON.stringify(result.rows));
            res.send('user successufully created: '+username);
        }
    });
});
app.post('/login', function (req, res) {
    
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1',[username], function(err,result){
        if(err){
                res.status(500).send(err.toString())}
        else
        {
            //res.send(JSON.stringify(result.rows));
            if(result.rows.length === 0)
            {
                res.status(403).send('username/password is invalid');
            }
            else
            {
                //match the password
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt);
                if(hashedPassword === dbString)
                {
                    res.send('Credentials are correct!');
                }
                else
                {
                    res.status(403).send('username/password is invalid');
                }
            }
        }
    });
});
/*app.get('/:articleName', function (req, res) {
    var articleName = req.params.articleName;
  res.send(createTemplate(artcles[articleName]));
});*/


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

/*app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});*/


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
