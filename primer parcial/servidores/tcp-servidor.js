const net = require('net');

const PUERTO = process.env.PUERTO || 5000;

const servidor = net.createServer((socket) => {
    const cliente =
        `${socket.remoteAddress}:${socket.remotePort}`;

    // Aquí el evento de conexión solo se dispara en el momento
    // en que cliente y servidor establecen three-way a través del
    // handshake (el apreton de manos es el momento en que el cliente
    // realiza una petición, envia IP, Puerto, Datagram y saluda al
    // servidor, el servidor le responde creando la sesión)
})