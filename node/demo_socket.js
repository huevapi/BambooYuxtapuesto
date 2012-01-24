var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(3000);

function handler (req, res) {
  var peticion = (req.url == '/') ? '/pizarra.html' : req.url;
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

var conexiones = [];
var points = {}
io.sockets.on('connection', function (socket) {
	conexiones.push(socket);
	console.log('conexion registrada');
	
	socket.emit('redraw', points);
	socket.on('addClick', function(data) {
		points[data.x + 'x' + data.y] = data.color;
		socket.emit('redraw', points);
	})
});
