const http = require('http');
const fs = require('fs');
const path = require('path');
let bodyParser = require('querystring');  // Utilizado para parsear datos de la solicitud POST

const server = http.createServer((req, res) => {
    // RUTA GET para enviar el index.html
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // Ruta para manejar la multiplicación de matrices
    else if (req.method === 'POST' && req.url === '/multiplicar') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Recibir datos en trozos
        });

        req.on('end', () => {
            try {
                // Parsear los datos JSON enviados desde el frontend
                const datos = JSON.parse(body);
                const matriz1 = datos.matriz1;
                const matriz2 = datos.matriz2;

                // Verificar que las matrices no estén vacías
                if (!matriz1 || !matriz2) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Datos inválidos' }));
                }

                // Verificar si las dimensiones son compatibles
                if (matriz1[0].length !== matriz2.length) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Las dimensiones no son compatibles para multiplicar las matrices.' }));
                }

                // Multiplicar matrices
                const resultado = multiplicarMatrices(matriz1, matriz2);

                // Enviar resultado
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ resultado: resultado }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error procesando los datos' }));
            }
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});

// Función para multiplicar las matrices
function multiplicarMatrices(matriz1, matriz2) {
    const filas1 = matriz1.length;
    const columnas1 = matriz1[0].length;
    const filas2 = matriz2.length;
    const columnas2 = matriz2[0].length;

    let resultado = [];

    for (let i = 0; i < filas1; i++) {
        let filaResultado = [];
        for (let j = 0; j < columnas2; j++) {
            let suma = 0;
            for (let k = 0; k < columnas1; k++) {
                suma += matriz1[i][k] * matriz2[k][j];
            }
            filaResultado.push(suma);
        }
        resultado.push(filaResultado);
    }

    return resultado;
}

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
