/*jshint esversion: 6*/
const express = require('express');
const app = express();
const Chuck  = require('chucknorris-io');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const client = new Chuck();

app.use(express.static('public'));
app.use(
  morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static('search'));
//app.use(express.static('random'));
//app.use(express.static('categories'));


app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/', function (request, response, next) {

  response.send('<h1>wellcome page from localhost root</h1>'+
                '<p>Wellcome Ironhacker by george. :)</p>'+
                '<b>From this link we go to index page</b><br/>'+
                '<a href="/index">index</a>');
  //next(); innecesario
});

app.get('/index',function(request,response){
  response.render('index.ejs');
  });

app.get('/random',function(request,response){
  let myClient = client.getRandomJoke();
  myClient
    .then(function (joke) {
     //response.send(joke.value); //send, direct mode
     response.render('random.ejs',{
       randomJoke:joke.value,
       url:joke.iconUrl
     }); //rendering ejs
   })
     .catch(function (err) {
         // handle error
         response.send(`error`);
     });
});


  app.get('/categories', function(request,response) {
    let myJoke = client.getJokeCategories();
    myJoke
      .then(function (rest) {
        console.log(rest);
        response.render('categories',{categories:rest});
      }).catch(function (err) {
            response.send(`error`);// handle error
      });

  });


  app.get('/categories/:catName',function(req,res){
    const catChosen = req.params.catName;
    client.getRandomJoke(catChosen)
      .then(function (joke) {
        res.render('joke-by-category',{category:catChosen,joke:joke.value});
      }).catch(function (err) {
        // handle error
      });

  });

  app.get('/search',function(req,res){
    res.render('search-form');
  });

  app.post('/search',function(req,res){
    //res.send('hola');
    const searchTerm=req.body.keyboard;
    client.search(searchTerm).then(function (response) {
        let rsearch=response.items;
        res.render('search-show',{term:searchTerm,items:rsearch});
    }).catch(function (err) {
        // handle error
    });
  });

// Retrieve a random chuck joke
/*client.getRandomJoke().then(function (response) {

  app.get('/random',function(request,response){
    response
      .render(`index.ejs`, {
      foo: myJoke
    });

}).catch(function (err) {
    // handle error
});
}

*/

/*
app.post('/login',function(request,response){
const name= request.body.name // equivalente a const {name}=request.body
const password = request.body.password
response.send(`wellcome ${name}`)
});

*/

app.listen(3000, () => {
  console.log('App chuck Norris port 3000!');
});


/*
```javascript
const Chuck  = require('chucknorris-io'),
      client = new Chuck();

// Retrieve a random chuck joke
client.getRandomJoke().then(function (response) {
    // to stuff here
}).catch(function (err) {
    // handle error
});

// Retrieve a random chuck joke from the given category
client.getRandomJoke('dev').then(function (response) {
    // to stuff here
}).catch(function (err) {
    // handle error
});

// Retrieve a list of available joke categories
client.getJokeCategories().then(function (response) {
    // to stuff here
}).catch(function (err) {
    // handle error
});

// Free text search
client.search(searchTerm).then(function (response) {
    // to stuff here
}).catch(function (err) {
    // handle error
});
```
*/
