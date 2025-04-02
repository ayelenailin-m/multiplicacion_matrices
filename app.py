from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/multiplicar', methods=['POST'])
def multiplicar():
    datos = request.get_json()
    matriz1 = datos.get('matriz1')
    matriz2 = datos.get('matriz2')

    if not matriz1 or not matriz2:
        return jsonify({'error': 'Datos inválidos'}), 400

    filas1, columnas1 = len(matriz1), len(matriz1[0])
    filas2, columnas2 = len(matriz2), len(matriz2[0])

    # Verificar si la multiplicación es posible
    if columnas1 != filas2:
        return jsonify({'error': 'Las dimensiones no son compatibles para multiplicar las matrices.'}), 400

    # Multiplicación de matrices
    resultado = [[sum(matriz1[i][k] * matriz2[k][j] for k in range(columnas1)) for j in range(columnas2)] for i in range(filas1)]

    return jsonify({'resultado': resultado})

if __name__ == '__main__':
    app.run(debug=True)
