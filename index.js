// Config del servidor
const express = require('express');
const app = express();
const apiRouter = require('./src/RouterApi');
const path = require('path');
const PORT = 8080;
const handlebars = require('express-handlebars')
const {engine} = handlebars;

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { Contenedor } = require('./src/clases/Contenedor.js');
const fs = require('fs').promises;
let fsModule;

const chat = [];

fsModule = new Contenedor(fs, __dirname + '/src/file/mensajes.txt');

async function iniciarMensajeria(){
    try {
        const hasFile = await fsModule.hasFile();
        if(!hasFile){
            const create = await fsModule.createFile();
            if(create !== true){
                throw "Error al crear el archivo";
            }else{
                return true;
            }
        }else{
            return true;
        }       
    } catch (error) {
        console.error(`Error: ${error}`);
        return false;
    }
}

function refreshIoTableProds(){
    let prods = apiRouter.Controlador.getProductos();
    if(!Array.isArray(prods)){
       prods = false; 
    }else{
        io.sockets.emit('refreshProductos', prods);
    }    
}

function refreshMensajeria(){
    fsModule.getAll()
    .then((chat)=>{
        io.sockets.emit('refreshMessages', chat);
    })
    .catch((error)=>{error.message});
}

iniciarMensajeria()
.catch((error)=>{error.message});



app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "layout.hbs",
    })
);

app.set("views", "./src/views");
app.set("view engine", "hbs");

app.use('/', apiRouter.router);
app.use('/', apiRouter.errorHandler);

app.use(express.static(path.join(__dirname ,'public')));

io.on('connection', (socket) => {
    refreshIoTableProds();
    refreshMensajeria();
    socket.on('new-product', (item) => {
        const prod = apiRouter.Controlador.saveProducto(item);
        if(prod){
            refreshIoTableProds();
        }else{
            console.log('error');
        }
    });

    socket.on('new-message', (msg, usuario) => {
        const msj = {};
        msj.user = (typeof usuario !== "undefined")?usuario:'anonimo';
        msj.message = msg;
        msj.time = new Date().toLocaleString();
        fsModule.save(msj)
        .then((res)=>{
            (res != null)?refreshMensajeria():false;
        })
        .catch((error)=>{error.message});
    });

});

server.listen(PORT, () => {
    console.log('Servidor iniciado.');
})

server.on("error", error => console.log(`Error en servidor ${error}`));