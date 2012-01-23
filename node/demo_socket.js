var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80);

function handler (req, res) {
  var peticion = (req.url == '/') ? '/index.html' : req.url;
  fs.readFile(__dirname + peticion,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

/*var conexiones = {servidor:'', cliente:''}
io.sockets.on('connection', function (socket) {
	// socket.emit('news', { hello: 'world' });
	socket.on('iniciar', function(data) {
		if(data.soy == 'servidor') {
			conexiones.servidor = socket;
			console.log('tenemos servidor!');
			//console.log(conexiones)
		}else{
			conexiones.cliente = socket;
			console.log('tenemos cliente!');
			//console.log(conexiones)
		}
	});
	socket.on('mouse', function (data) {
		conexiones.cliente.emit('news', data);
	});
});*/
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var conexiones = [];
io.sockets.on('connection', function (socket) {
	conexiones.push(socket);
	console.log('conexion registrada');
	
	socket.on('obtenerPizarra', function(data) {
		socket.emit('datosPizarra', pizarra);
	});
	
	socket.on('addClick', function(data) {
		clickX.push(data.x);
		clickY.push(data.y);
		clickDrag.push(data.dragging);
		for(var i = 0; i<conexiones.length; i++) {
			var cliente  = conexiones[i];
			cliente.emit('redraw', {x: clickX, y: clickY, drag: clickDrag})
		}
	})
});