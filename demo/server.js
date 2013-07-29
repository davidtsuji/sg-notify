var connect = require('connect');
   
connect()
	.use(connect.static(__dirname))
	.use(connect.static(__dirname+'/../build/'))
	.listen(5000);

console.log('Listening on 5000');