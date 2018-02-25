// Include express framework
var express = require("express");
var app = express();
var server = require('http').Server(app);

// Include request package
var request = require("request");

// Tell express we are using ejs
app.set("view engine", "ejs");

// ============================================================================
// TWITTER
// ============================================================================
var Twitter = require("twitter");

var client = new Twitter({
    consumer_key: 'tno16itV5wzPgC7hlGVe7ypj8',
    consumer_secret: 'IltwOpECIY8Biv82cckScKEeVJ4bulIT66pZAeiFJANOPFlnDv',
    access_token_key: '825029227565035520-yQDFEpwaVKpv2EUaOh4s2M9zaWtkziz',
    access_token_secret: 'ALsOHyE2Fs6HyWGZHfhyIovVu6HY0Plhp8voAOpIcV8kh'
});

var params = {screen_name: 'nodejs'};

// ============================================================================
// SOCKET.IO
// ============================================================================
var io = require('socket.io')(server);
server.listen(3000);

io.on('connection', function(client) {  
    console.log('Client connected...');
    
    client.on('join', function(data) {
        console.log(data);
    });
});

    
// ============================================================================
// ROUTES
// ============================================================================

// Landing page route
app.get('/', function(req, res) {
   res.render("app");
});


//Get tweets from Twitter API
app.get('/search', function(req, res) {
    var searchQuery = req.query.search;
    //var positon = req.body.geoData;
    
    //console.log(positon);
    
    // Get tweet information from Twitter API
    client.get('/search/tweets', {q: searchQuery, latitude:40.009791 ,longitude: -105.242459 , radius: "10km", count: 50, lang: "en"}, function(error, data, response) {
        if(!error && response.statusCode == 200) {
            
            // Variable to hold tweets obtained from api
            var tweets = [];
            
            // Maximum number of tweets can pull from API (Up to 50)
            var maxLen = data['statuses'].length - 1;
            console.log(maxLen);
            
            // Loop through creating Tweet object and adding tweets to array
            for(var i = 0; i < maxLen; i++) {
               // Store data if 'statuses' is not empty
                if(data['statuses'].length != 0) {
                    var name = data['statuses'][i]['user']['name'];
                    var tweetContent = data['statuses'][i]['text'];
                    var numRetweets = data['statuses'][i]['retweet_count'];
                }
                else {
                    res.send("No tweets to display :(");
                }
                
                // Object with all data needed to display tweet
                var Tweet = {
                    Name: name,
                    TweetContent: tweetContent,
                    NumRetweets: numRetweets
                };
                
                // Push Tweet into array
                tweets.push(Tweet);
            }
            
            // console.log(tweets);
            
            // Render results page
            res.render('results', {tweets: tweets});
        }
        else {
            console.log("Error...");
        }
    });
});

// Start server and listen for request
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("GeoTwitter Server Started..."); 
});


// ============================================================================
// FUNCTOINS
// ============================================================================
