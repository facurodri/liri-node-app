require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var whatIsSearched = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

// Search movie 
if (whatIsSearched === "movie-this") {
    function movieThis() {
        var movie = userInput;
        var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=bb08e3ea";
        if (userInput === "") {
            userInputText = "Mr. Nobody";
            console.log("If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/>");
            console.log("It's on Netflix!");
        } else {
            axios.get(queryUrl)
                .then(function (response) {
                    console.log("\r\nSearched movie: " + userInput.toUpperCase());
                    console.log("Release Year: " + response.data.Year);
                    console.log("IMDB Rating: " + response.data.imdbRating);
                    console.log("Rotten Tomato's Rating: " + response.data.Ratings[1].Value);
                    console.log("Country of Movie Production: " + response.data.Country);
                    console.log("Movie Language: " + response.data.Language);
                    console.log("\r\nMovie Plot: " + response.data.Plot);
                    console.log("\r\nActors in Film: " + response.data.Actors);
                })
            }
        }
        movieThis();
}
//search for concert
if (whatIsSearched === "concert-this") {
    function concertThis() {
        var band = userInput;
        var queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
        if (userInput === "") {
            userInput = "Vampire Weekend";
            console.log("If you've never been to a live concert go watch Vampire Weekend");
            console.log("Coming to Cleveland on June 14th 2019");
        } else {
            axios.get(queryUrl)
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        console.log("\r");
                        console.log("Venue: " + response.data[i].venue.name);
                        var location = response.data[i].venue.city;
                        location += ", " + response.data[i].venue.country;
                        console.log("Location: " + location);
                        var when = response.data[i].datetime;
                        console.log("When: " + moment(when).format('L'));
                        console.log("\r\n -------------------");
                    }
                })
            }
        }
        concertThis();
}
//search for song
if (whatIsSearched === "spotify-this-song") {
    function spotifyThis(song) {
        if (userInput === "") {
            console.log("The Sign by Ace of Base");
        } else {
            spotify
                .search({
                    type: 'track',
                    query: userInput
                })

                .then(function (response) {
                    for (var i = 0; i < 10; i++) {
                        console.log("\r --------------------------");
                        console.log("Artist/s: " + response.tracks.items[i].album.artists[0].name);
                        console.log("Song Name: " + response.tracks.items[i].name);
                        console.log("URL Preiview: " + response.tracks.items[i].external_urls.spotify);
                        console.log("Album: " + response.tracks.items[i].album.name);
                    }
                    
                })
                .catch(function (err) {
                    console.log(err);
                });
            }
            
        }
        spotifyThis();
}
if (whatIsSearched === "do-what-it-says") {
    function doIt() {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
        console.log(data);
        })
    }
doIt();
}


