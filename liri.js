require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var whatIsSearched = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

function switchboard(searched, input) {
    switch (searched) {
        case "movie-this": 
            movieThis(input);
            break;
        case "concert-this": 
            concertThis(input);
            break;
        case "spotify-this-song": 
            spotifyThis(input);
            break;
        case "do-what-it-says":
            doIt();
            break;
        default: 
            console.log("Search for a movie by typing 'node liri movie-this [movie]' into terminal");
            console.log("Search for a concert by typing 'node liri concert-this [band]' into terminal");
            console.log("Search for a song by typing 'node liri spotify-this-song [song]' into terminal");
            console.log("Need an Example: type 'node liri do-what-it-says' and see how it works");
            console.log("Enjoy");
            
    }
}
switchboard(whatIsSearched,userInput);

function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var arr = data.split(",");
        for (var i = 0; i < arr.length; i ++) {
            if (i % 2 === 0){
                switchboard(arr[i], arr[i+1]);
            }
        }
    })
}

function concertThis(concert) {
   
    var queryUrl = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp";
    if (concert === "") {
        concert = "Vampire Weekend";
        console.log("If you've never been to a live concert go watch Vampire Weekend");
        console.log("Coming to Cleveland on June 14th 2019");
    } else {
        axios.get(queryUrl)
            .then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    console.log("\r");
                    console.log("Artist/s: " + response.data[i].lineup[0]);
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
function movieThis(movie) {
    
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=bb08e3ea";
    if (movie === "") {
        userInputText = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!");
    } else {
        axios.get(queryUrl)
            .then(function (response) {
                console.log("\r\nSearched movie: " + movie.toUpperCase());
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
function spotifyThis(song) {
    if (song === "") {
        console.log("The Sign by Ace of Base");
    } else {
        spotify
            .search({
                type: 'track',
                query: song
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