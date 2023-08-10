import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import {Server} from 'socket.io';
const app = express();

//Se inicializa el motor de plantillas
app.engine('handlebars', handlebars.engine());

//Establece la ruta de las vistas
app.set('views', __dirname + '/views');

//Establece el motor de renderizado
app.set('view engine', 'handlebars');

//Establece el servidor estático de archivos
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor arriba en el puerto ${PORT}`);
});

const io = new Server(httpServer);

const messages = [];
io.on('connection', socket => {
    console.log('Nuevo cliente conectado ', socket.id);

    socket.on('message', data => {
        messages.push(data);
        io.emit('messagesLogs', messages);
    });

    socket.on('userConnect', data => {
        socket.emit('messagesLogs', messages);
        socket.broadcast.emit('newUser', data);
    })
});
