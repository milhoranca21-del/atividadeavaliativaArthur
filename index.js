import express from 'express';

const host="0.0.0.0";
const porta = 3000;

const Server =express();

Server.listen(porta,host,() => {
    console.log(`Servidor escutando http://${host}:${porta} `)
});
 