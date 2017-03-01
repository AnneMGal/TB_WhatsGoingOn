var twitterAPI = require('node-twitter-api');

/*var consumerKey = process.argv[2];
var consumerSecret = process.argv[3];
var accessToken = process.argv[4];
var tokenSecret = process.argv[5];*/

console.log('The bot is starting');

var TwitterAPI = require('node-twitter-api');
var util = require('util');
var fs = require('fs');
//var sleep = require('sleep');
//var rita = require('rita');

// verifications and tokens
var secrets = JSON.parse(fs.readFileSync("../../__secrets/whatsgoingon_secrets.json"));

var cKey = secrets["cKey"];
var cSecret = secrets["cSecret"];
var accessToken = secrets["accessToken"];
var tokenSecret = secrets["tokenSecret"];
var myScreenName = "watsgoingonnow"

console.log('step 1');

// create a twitter API object
var twitter = new TwitterAPI({
    consumerKey: cKey,
    consumerSecret: cSecret});

var realScore = 0;
var fakeScore = 0;

console.log('step 2');

// Name,Twitter Name,Twitter Website,Home Website
var text_news = fs.readFileSync("News_Publications.csv", 'utf8').split("\r");

// the "filter" stream allows you to track specific terms. the onData
// callback is called whenever a tweet with that term appears.
twitter.getStream("filter", {"track": "real news,fake news"}, accessToken, tokenSecret, onData);

// tweet score every five minutes (1000 milliseconds * 60 seconds * 5 minutes)

// 5 minutes
setInterval(tweetCurrentScore, 1000 * 60 * 5);

// 10 seconds
//setInterval(tweetCurrentScore, 1000 * 10);


console.log('step 3');

function onData(error, streamEvent) {


    // skip if empty
    if (Object.keys(streamEvent).length === 0) {
        return;
    }
    var text = streamEvent['text'].toLowerCase();
    if (text.indexOf('real news') != -1) {
        realScore++;
    }
    if (text.indexOf('fake news') != -1) {
        fakeScore++;
    }
}

console.log('step 4');

function tweetCurrentScore() {
     
    // a random int between [0 and text_news.length]
	var i = Math.floor(Math.random()*text_news.length);

	var winning = " ";

	if (fakeScore > realScore){
		winning = "Fake news is winning. "
	} else if (realScore > fakeScore){
		winning = "Real news is winning. "
	} else {
		winning = "Real and Fake news are tied. "
	}

	var updateText = "current score: Real News " + realScore + ", Fake News " + fakeScore + ". " + winning + 
				"Read more real news from " + text_news[i].split(',')[0] + " at " + text_news[i].split(',')[2]

	console.log(updateText)

    
    twitter.statuses(
        "update",
        {"status": updateText},
        accessToken,
        tokenSecret,
        function (err, data, resp) { console.log(err); }   
    ); 
    
    realScore = 0;
	fakeScore = 0;
 
console.log('step 5');
}