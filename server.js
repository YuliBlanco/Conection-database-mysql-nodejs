var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
 
var app = express();

   app.set('views', __dirname + '/views');
   app.set('view options', { layout: false });
   app.use(express.bodyParser());
   app.use(express.static(__dirname + '/public'));

 
var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'equipos',
});

client.database = 'equipos';

app.get('/', function(req, res) {
    
    client.query('SELECT id, nombre, ciudad FROM equipos',
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;                  
                }

                res.render('index.jade', { equipos: results });
            }
        );
});


app.post('/nueva', function(req, res) {

    client.query('INSERT INTO equipos (nombre, ciudad) VALUES (?, ?)', [req.body.nombre, req.body.ciudad],
            function() {
                res.redirect('/');
            }
        );
});


app.get('/editar/:id', function(req, res) {
    client.query('SELECT id, nombre, ciudad FROM equipos WHERE id = ?', [req.params.id],
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;                  
                }
                
                res.render('editar.jade', { equipos: results[0] });
            }
        );
});

app.post('/actualizar', function(req, res) {
    client.query('UPDATE equipos SET nombre = ?, ciudad = ? WHERE id = ?', [req.body.nombre, req.body.ciudad, req.body.id],
            function() {            
                res.redirect('/');
            }
        );
});

app.get('/borrar/:id', function(req, res) {
    client.query('DELETE FROM equipos WHERE id = ?', [req.params.id],
        function() {
            res.redirect('/');
        }
    );
});

app.listen(3333);
