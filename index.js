'use strict'

var fetch = require('node-fetch');

let pays = [] ;
async function initialize(){
  let response = await fetch("https://api.openaq.org/v1/countries",{mode : "cors"});
  let json = await response.json();
  //console.log("resultat json ",json)
  let results = json.results ;
  results.forEach(function(result){
    //console.log("resultat result",result.name)
     if (result.name) pays.push(result.name);
   });
console.log(" initialize, liste des pays", pays);
}


initialize();
console.log("apres initialize:" , pays);


var express = require('express');
var app = express();

const port = process.env.PORT || 3000 ;


var https = require('https');


var cors = require('cors');

var corsOptions = {
    origin: 'https://marwa10.github.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


//serves static files
app.use(express.static('docs'));


/*Fetch list of countries
//app.get("/data/pays", cors(corsOptions), function(req, res){
    let names =;
    let pays = [] ;
    let url = "https://api.openaq.org/v1/countries" ;
    fetch(url)
    .then(res => res.json())
    .then(json => {
    let results = json.results ;
    results.forEach(function(results){
      names.push(results.name);
    });
    pays = names.filter(function( element ) {
      return element !== undefined;
    });
    document.getElementById('liste_pays').innerHTML = pays;
    console.log(pays);
    res.send("data fetched look your console");
    });
*/



// Page d'acceuil On revoit la page html --------------------------------
app.get('/data', function (req, res) {
        console.log("dans get", pays);
        res.setHeader('Content-Type','text/html');
        res.sendFile(__dirname + '/docs/index.html');
})






// Fetch measurments of a specific country and date range
app.get("/fetchair/tout", cors(corsOptions), function(req, res){
    let country = "FR";
    let d_from="2020-10-01";
    let d_to ="2020-10-30";

    let url = "https://api.openaq.org/v1/measurements?country=" +country +
               "&date_from="+ d_from+ "&date_to="+ d_to +"&parameter[]=co&parameter[]=pm25";
    fetch(url)
    .then(res => res.json())
    .then(json => {
        console.log("fetchair", json);

        res.format({
            'text/html': function () {
            res.send("data fetched look your console");
            },
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(json);
              }
            })
    });
})

// API Covid
app.get("/fetchcovid/tout", cors(corsOptions), function(req, res) {
  let date_begin = "2020-05-20";
  let date_end = "2020-06-20";
  let url = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/" + date_begin + "/" + date_end;
  fetch(url)
    .then(res => res.json())
    .then(json => {
      console.log("covid", json);
      res.send("data fetched look your console");
      res.format({
            'text/html': function () {
            res.send("data fetched look your console");
            },
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(json);
              }
            })
    });
})




app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
