import express from 'express';

const host="0.0.0.0";
const porta = 3000;

const server =express();





server.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Sistema de Reajuste</title>
        </head>
        <body>
            <h1>Sistema de Reajuste Salarial</h1>
        
             <p>Exemplo:</p>
                <p>http://localhost:3000/reajuste?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=123</p>
        </body>
        </html>
    `);
});

 server.get('/reajuste', (req, res) => {

    const idade = parseInt(req.query.idade);
    const sexo = req.query.sexo;
    const salarioBase = parseFloat(req.query.salario_base);
    const anoContratacao = parseInt(req.query.anoContratacao);
    const matricula = parseInt(req.query.matricula);

    // Validações
   if (
    isNaN(idade) || idade <= 16 ||
    (sexo !== 'M' && sexo !== 'F') ||
    isNaN(salarioBase) || salarioBase <= 0 ||
    isNaN(anoContratacao) || anoContratacao <= 1960 ||
    isNaN(matricula) || matricula <= 0
) {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Erro</title>
            </head>
            <body>
                <h1>Erro no cálculo</h1>
                <p>Dados inválidos.</p>
                <p>Verifique se:</p>
                <ul>
                    <li>Idade maior que 16</li>
                    <li>Sexo = M ou F</li>
                    <li>Salário base número válido</li>
                    <li>Ano de contratação maior que 1960</li>
                    <li>Matrícula maior que zero</li>
                </ul>
                <p>Exemplo:</p>
                <p>http://localhost:3000/reajuste?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=123</p>
            </body>
            </html>
        `);
    } else {

        const anoAtual = new Date().getFullYear();
        const tempoEmpresa = anoAtual - anoContratacao;

        let percentual = 0;
        let valorExtra = 0;

        // Regras da tabela
        if (idade >= 18 && idade <= 39) {
            if (sexo === 'M') {
                percentual = 0.10;
                valorExtra = tempoEmpresa <= 10 ? -10 : 17;
            } else {
                percentual = 0.08;
                valorExtra = tempoEmpresa <= 10 ? -11 : 16;
            }
        }
        else if (idade >= 40 && idade <= 69) {
            if (sexo === 'M') {
                percentual = 0.08;
                valorExtra = tempoEmpresa <= 10 ? -5 : 15;
            } else {
                percentual = 0.10;
                valorExtra = tempoEmpresa <= 10 ? -7 : 14;
            }
        }
        else if (idade >= 70 && idade <= 99) {
            if (sexo === 'M') {
                percentual = 0.15;
                valorExtra = tempoEmpresa <= 10 ? -15 : 13;
            } else {
                percentual = 0.17;
                valorExtra = tempoEmpresa <= 10 ? -17 : 12;
            }
        }

        const reajustePercentual = salarioBase * percentual;
        const novoSalario = salarioBase + reajustePercentual + valorExtra;

        res.setHeader('Content-Type', 'text/html');

        res.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Reajuste Salarial</title>
            </head>
            <body>
                <h1>Resultado do Reajuste</h1>

                <h2>Dados do Funcionário</h2>
                <p><strong>Matrícula:</strong> ${matricula}</p>
                <p><strong>Idade:</strong> ${idade}</p>
                <p><strong>Sexo:</strong> ${sexo}</p>
                <p><strong>Salário Base:</strong> R$ ${salarioBase.toFixed(2)}</p>
                <p><strong>Ano de Contratação:</strong> ${anoContratacao}</p>
                <p><strong>Tempo de Empresa:</strong> ${tempoEmpresa} anos</p>

                <hr>

                <h2 style="color: green;">
                    Novo Salário: R$ ${novoSalario.toFixed(2)}
                </h2>

            </body>
            </html>
        `);

        res.end();
    }
});

server.listen(porta,host,() => {
    console.log(`Servidor escutando http://${host}:${porta} `)
});