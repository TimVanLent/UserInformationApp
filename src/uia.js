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
				var count1 = 0
				var count = 0
				var suggestions = [];
				var keyArray = []
				for (i = 0; i < parsedData.length; i++) {

					for (var key in parsedData[i]) {
						valueKey = parsedData[i][key];
						keyArray.push(valueKey)
					}
					count1++;
					if (count1 === parsedData.length) {
						for (j = 0; j < keyArray.length; j++) {
							var sensitive = keyArray[j];
							var lowercase = sensitive.toLowerCase();


							var partWordUnsens = lowercase.substring(0, typing.length); //substring
							var partWordSens = sensitive.substring(0, typing.length); //substring


							if (partWordUnsens === typing || partWordSens === typing && typing.length !== 0) {

								suggestions.push(sensitive);
								count++;
								if (count === keyArray.length) {
									if (suggestions.length === keyArray.length) {
										suggestions = ['no match']
									};
									console.log('found some matching results bruh!');
									res.send({
										object: suggestions
									});
								}

							} else {
								count++;

								if (count === keyArray.length && suggestions.length > 0) {
									if (suggestions.length === keyArray.length) {
										suggestions = ['no match']
									};
									console.log('found some matching results bruh!');
									res.send({
										object: suggestions
									});
								} else if (count === keyArray.length && suggestions.length === 0) {

									suggestions.push("no match")

									console.log('nothing found');
									res.send({
										object: suggestions
									});
								}

							}
						}
					}
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
				parsedData[i].lastname === req.body.firstname ||
				parsedData[i].email === req.body.firstname) {
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