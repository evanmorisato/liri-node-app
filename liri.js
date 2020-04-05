require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var action = process.argv[2];
var value = process.argv.splice(3,process.argv.length).join(' ');

 
switch(action) {
case 'concert-this':
    bandsInTown();
    break;
case 'spotify-this-song':
    spotifySong();
    break;    
case 'movie-this':
    movieThis();
    break;
case 'do-what-it-says':
    getRandom();
    break;    
default:
    console.log('LIRI does not know that');
    break;
}

function bandsInTown(action) {
    axios
    .get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
    .then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
            console.log("Concert Venue: "+ response.data[i].venue.name);
            console.log("Concert Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
            console.log("Concert Time: " + moment(response.data[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'));
            console.log("\n--------------------------------------------------------------\n");
        }
    });
}

function spotifySong(action) {

    var song = value;
    if (!song) {
        song = "The Sign Ace of Base"
    }
    spotify.search({ type: 'track', query: value }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      var songs = data.tracks.items;
      for(var i=0; i<songs.length; i++) {
          console.log(i);
          console.log('Artist(s): ' + songs[i].artists[i].name);
          console.log('Song name: ' + songs[i].name);
          console.log('Preview song: ' + songs[i].preview_url);
          console.log('Album: ' + songs[i].album.name);
          console.log('------------------------------------------------');
      } 
      });
}

function movieThis(action){
    var movie = value;
    if (!movie) {
        console.log("If you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>");
        movie = "Mr. Nobody";
    }
    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(url).then(
    function (response) {
    // console.log(response.data)
        console.log("======================================================\n")
        console.log("Movie Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("======================================================\n")
    });
};

function getRandom() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        action = dataArr[0];
        value = dataArr[1];
        if (action === "concert-this") {
            bandsInTown();
        } 
        else if (action === "spotify-this") {
            spotifySong();
        }
        else if (action === "movie-this") {
            movieThis();
        }
        
    })
}




