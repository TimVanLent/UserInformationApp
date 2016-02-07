var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');


app.set('views', './src/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
	fs.readFile('./users.json', function(err, data) {
		if (err) {
			console.log(err);
		}
		var parsedData = JSON.parse(data);
		console.log("haai dudes:" + parsedData.length);

		res.render('uia', {
			users: parsedData
		});
	})
});
//Starting with your previous website, 
//create a new branch to preserve the old site.
//Your site has a form on it that acts like a search bar. 
//On click, it should retrieve a list of matching users and list them by name on a new page.

//### 1. Autocomplete
//Modify your form so that every time the user enters a key, 
//it makes an AJAX call that populates the search results.
//Do this work in a git branch called "autocomplete". 
//Then, merge this branch into master with a pull request.
app.get('/form', function(req, res) {
	res.render('form');
});

app.post('/autoComplete',
		bodyParser.urlencoded({
			extended: true
		}),
		function(req, res) {
			fs.readFile('./users.json', function(err, data) {
					if (err) {
						console.log(err);
					} else if (true) {
						var parsedData = JSON.parse(data);

						var typing = req.body.first;
						var count = 0
						var suggestions = [];
						for (i = 0; i < parsedData.length; i++) {


							var sensitive = parsedData[i].firstname;
							var firstname = sensitive.toLowerCase();


							var firstletterUnsens = sensitive.substring(0, typing.length); //substring
							var firstletter = firstname.substring(0, typing.length); //substring

							// console.log("i :" + i)
							// console.log("suggestions.length :" + suggestions.length)
							// console.log("typing :" + typing);
							// console.log(typing.length)
							// console.log("firstletter :" + firstletter)
							// console.log("firstletterUnsens :" + firstletterUnsens);
							// console.log("suggestions.length is niet 0 : ");
							// console.log(suggestions.length !== 0)
							// console.log("typing is niet null: ")
							
							

							// console.log(firstletter);
							// console.log(firstname)
							if (firstletterUnsens === typing || firstletter === typing) {

								suggestions.push(sensitive);
								count ++;
								if (count === parsedData.length) {
								
									console.log('found some matching results bruh!');
									res.send({
										object: suggestions
									});
								} 

							} else {
								count++;

								if (count === parsedData.length && suggestions.length > 0) {
								
									console.log('found some matching results bruh!');
									res.send({
										object: suggestions
									});
								} else if (count === parsedData.length && suggestions.length === 0) {
									
									suggestions.push("no match")
									console.log(suggestions)
									console.log('nothing found');
									res.send({
										object: suggestions
									});
								}
							
							}
							
							// else if (i === parsedData.length - 1 && suggestions.length === parsedData.length - 1) {
							// 		console.log('cool bruh')
							// 		res.send('cool bruh');
							// 		break;
							// 	}



								// res.send array √
								// order the list
								// tolowercase


							}
						}
					});

			});

		app.post('/form', bodyParser.urlencoded({
			extended: true
		}), function(req, res) {

			fs.readFile('./users.json', function(err, data) {
				if (err) {
					console.log(err);
				}

				var parsedData = JSON.parse(data);
				var count = 0;

				for (i = 0; i < parsedData.length; i++) {

					if (parsedData[i].firstname === req.body.firstname ||
						parsedData[i].lastname === req.body.lastname ||
						parsedData[i].email === req.body.email) {
						count++
						res.render('user', {

							user: parsedData[i]
						})
					} else if (i === parsedData.length - 1 && count === 0) {
						console.log('invalid');
						res.render('invalid')
					}
				};

			});
		});

		app.get('/newUser', function(req, res) {
			res.render('newUser');
		});



		app.post('/newUser', bodyParser.urlencoded({
			extended: true
		}), function(req, res) {

			var aUser = new User(
				req.body.firstname,
				req.body.lastname,
				req.body.email
			)

			function User(firstname, lastname, email) {
				this.firstname = firstname;
				this.lastname = lastname;
				this.email = email;

				var newuser = this
					// var string = JSON.stringify(this)


				fs.readFile('./users.json', function(err, data) {
					if (err) {
						console.log(err);
					}
					var parsedData2 = JSON.parse(data);

					parsedData2.push(newuser)

					var string = JSON.stringify(parsedData2)


					fs.writeFile("./users.json", string, function(err) {
						console.log("making file...");

						if (err) {
							throw err;
						}
						res.redirect('/')
					})
				})
			};
		});

		var server = app.listen(3000);