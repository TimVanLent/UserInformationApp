

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


