var express = require('express');
var morgan = require('morgan');
var path = require('path'); 
var crypto = reuire('crypto');

var app = express();
app.use(morgan('combined'));

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
    return hashed.toSting('hex');
}

app.get('/hash/:input', function (req, res) {
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
  res.send(hashedString);
});

app.get('/:articleName', function (req, res) {
    var articleName = req.params.articleName;
  res.send(createTemplate(artcles[articleName]));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
