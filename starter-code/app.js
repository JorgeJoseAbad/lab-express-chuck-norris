/*jshint esversion: 6*/
const express = require('express');
const app = express();
const Chuck  = require('chucknorris-io');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const client = new Chuck();

const PORT = 3000;

app.use(express.static('public'));
app.use(
  morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));
app.use(bodyParser.urlencoded({ extended: true }));



app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/', function (request, response, next) {

  response.send('<h1>wellcome page from localhost root</h1>'+
                '<p>Wellcome Ironhacker by george. :)</p>'+
                '<b>From this link we go to index page</b><br/>'+
                '<a href="/index">index</a>');

});

app.get('/index',function(request,response){
  response.render('index.ejs');
  });

app.get('/random',function(request,response){
  let myClient = client.getRandomJoke();
  myClient
    .then(function (joke) {
       response.render('./random/random.ejs',{
         randomJoke:joke.value,
         url:joke.iconUrl
       });
     })
     .catch(function (err) {
         //response.send(err);
         response.render('promiseerror',{
           name :    err.name,
           filename : err.fileName,
           lineNumber : err.lineNumber,
           columnNumber : err.columnNumber,
           message : err.message,
           stack   : err.stack
         });
     });
});


  app.get('/categories', function(request,response) {
    let myJoke = client.getJokeCategories();
    myJoke
      .then(function (rest) {
        response.render('./categories/categories',{categories:rest});
      })
      .catch(function (err) {
        //response.send(err);
        response.render('promiseerror',{
          name :    err.name,
          filename : err.fileName,
          lineNumber : err.lineNumber,
          columnNumber : err.columnNumber,
          message : err.message,
          stack   : err.stack
        });
      });

  });


  app.get('/categories/:catName',function(req,res){
    const catChosen = req.params.catName;
    client.getRandomJoke(catChosen)
      .then(function (joke) {
        res.render('./categories/joke-by-category',{
          category:catChosen,
          joke:joke.value
        });
      })
      .catch(function (err) {
        //res.send(err);
        res.render('promiseerror',{
          name :    err.name,
          filename : err.fileName,
          lineNumber : err.lineNumber,
          columnNumber : err.columnNumber,
          message : err.message,
          stack   : err.stack
        })
      });

  });

  app.get('/search',function(req,res){
    res.render('./search/search-form');
  });

  app.post('/search',function(req,res){
    const searchTerm = req.body.keyboard;//error inducido
    client.search(searchTerm)
      .then(function (response) {
        let rsearch = response.items;
        res.render('./search/search-show',{
          term:searchTerm,
          items:rsearch
        });
      })
      .catch(function (err) {
        //res.send(err.stack);
        res.render('promiseerror',{
          name :    err.name,
          filename : err.fileName,
          lineNumber : err.lineNumber,
          columnNumber : err.columnNumber,
          message : err.message,
          stack   : err.stack
        })

      });
  });

// catch 404 and forward to error handler if no route is found
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //err.status testing
  err.status = 500;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(PORT, () => {
  console.log('App chuck Norris port 3000!');
});
