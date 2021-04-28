

var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var port = process.env.PORT || 3000;

// var obj = require('./display_db.js');
// var obj = require('./test.js');

const { MongoClient } = require('mongodb');

const url = "mongodb+srv://niallsheridan:ryder56nbs@cluster0.ytcqd.mongodb.net/companies?retryWrites=true&w=majority";
	
const client = new MongoClient(url, { useUnifiedTopology: true });

	

// async function find(err, items, res)
// {
// 	console.log(pdata);
// 	res.write("<br/>");

// 	if (err) {
// 		console.log("Error here: " + err);
// 	} else {

// 		console.log("here");

// 		console.log("Items: " + items.length);
// 		await items.forEach(function(thing) {
// 			console.log(1 + ": " + thing.ticker);
// 			res.write(thing.ticker + "<br/>");
// 		});
// 		// for (i=0; i<items.length; i++) {
// 		// 	console.log(i + ": " + items[i].ticker);
// 		// 	res.write(items[i].ticker + "<br/>");
// 		// }
// 	}
// 	res.end();

// }	
			

// function find2(err, items, res, client)
// {
	// try {
		// console.log(pdata);
		// if (err) {
		// 	console.log("Error: " + err);
		// } else {
		// 	res.write("<br/>");
		// 	console.log("here");

		// 	console.log("Items: " + items.length);
		// 	for (i=0; i<items.length; i++) {
		// 		console.log(i + ": " + items[i].name);
				
		// 		res.write(items[i].name + "<br/>");
		// 	}
		// }
		// res.end();
		// client.close();
	// } finally {

	// }
	
// }	

async function parse1(pdata, res)
{
	

	try {

		pdata = qs.parse(pdata);

		theQuery = {name:pdata['the_name']};
		theQuery2 = {ticker:pdata['the_ticker']};
		console.log("the query1 is " + theQuery);
		console.log("the query2 is " + theQuery);

		await client.connect();
		// if(err) { 
		// 	console.log("Connection err: " + err); return; 
		// }

		var dbo = await client.db("companies");
		var collection = await dbo.collection('companies');
		console.log("before find");



	// theQuery="";
		result = await collection.find(theQuery);
		console.log("in between: " + result);
		result.toArray(function(err, items) {

			//find(err, items, res, pdata);
			console.log("pdata1: " + JSON.stringify(pdata));
			res.write("<br/>");

			if (err) {
				console.log("Error: " + err);
			} else {

				console.log("here");

				console.log("Items: " + items.length);
				for (i=0; i<items.length; i++) {
					console.log(i + ": " + items[i].ticker);
					res.write(items[i].name + ", " + items[i].ticker + "<br/>");
				}
				// items.forEach(function(thing) {
				// 	console.log(1 + ": " + thing.ticker);
				// 	res.write(items[i].name + ", " + items[i].ticker + "<br/>");
				// });
			}
			// res.end();
			// client.close();
		});

		result2 = await collection.find(theQuery2);

		result2.toArray(function(err, items) {

			// find2(err, items, res, pdata, client);
			console.log("pdata2:" + JSON.stringify(pdata));
			if (err) {
				console.log("Error: " + err);
			} else {
				res.write("<br/>");
				console.log("here");

				console.log("Items: " + items.length);
				for (i=0; i<items.length; i++) {
					console.log(i + ": " + items[i].name);
					
					res.write(items[i].name + ", " + items[i].ticker + "<br/>");
				}
				res.end();
				console.log("close please");
				client.close();

			}

		});
	} finally {


		console.log("before close!");
		//client.close();
		// res.end();
		console.log("after close!");

	}
		console.log("succ");


}

function create(req, res)
{
	if (req.url == "/")
	  {
		  file = 'form.html';
		  fs.readFile(file, function(err, txt) {
		  res.writeHead(200, {'Content-Type': 'text/html'});
		  res.write("This is the home page<br>");
	      res.write(txt);
	      res.end();
		  });
	  }
	  else if (req.url == "/process")
	  {
	 	res.writeHead(200, {'Content-Type':'text/html'});
	 	res.write ("Process the form<br>");
	 	pdata = "";
	 	req.on('data', data => {
	   	pdata += data.toString();
	 	});

		// when complete POST data is received
		req.on('end', () => {

			parse1(pdata, res);
		});

		req.on('close', function(err) { console.log("here!")});
		}
		else 
		  {
			  res.writeHead(200, {'Content-Type':'text/html'});
			  res.write ("Unknown page request");
			  res.end();
		  }


		// await client.close();



}


function main()
{

	httpServer = http.createServer(function (req, res) {
		create(req, res);
		//res.end();
	}).listen(port);

	httpServer.setTimeout(port, ()=>{
  
		 console.log("Socket is destroyed due to timeout")
		  
	    httpServer.close(()=>{
	        console.log("Server is closed")
	    })
	})


//}
// console.log(pdata['the_name']);

console.log("after close");
}


main();


