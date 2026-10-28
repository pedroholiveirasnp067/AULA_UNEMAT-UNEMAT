/*
let soma = 0;
for (let i = 0; i < 5; i++){
    let valor = parseInt(prompt("Digite um valor: "));
    soma += valor;
}
console.log(`A soma dos valores digitados é ${soma}`);
*/

/*
let parada = true;
while (parada){
    numero = parseInt(prompt('digite um número: '));
    if (numero % 2 == 0){
        console.log(`O número ${numero} é par`);
        parada = false;
    }
    else{
        console.log(`O número ${numero} é ímpar`);
        parada = false;
    }
}
*/

/*
let parada = true;
do{
    let numero = parseInt(prompt('Digite um número ímpar: '));
    if (numero % 2 != 0){
        console.log(`O número ${numero} é ímpar`);
        parada = false;
    }
}
while (parada);
*/

/*
let num1 = parseInt(prompt('digite um número: '));
let num2 = parseInt(prompt('digite o segundo número: '));

let operacao = null;
do{
    operacao = prompt('Digite a operação (+,-,*,/): ');
}
while (
    operacao != '+' &&
    operacao != '-' &&
    operacao != '*' &&
    operacao != '/'
);

let resultado = null;

if (operacao == '+'){
    resultado = Number(num1) + Number(num2);
}
else if (operacao == '-'){
    resultado = Number(num1) - Number(num2);
}
else if (operacao == '*'){
    resultado = Number(num1) * Number(num2);
}
else if (operacao == '/'){
    if (num2 == 0){
        console.log('Não é possível dividir por zero');
    }
    else{
        resultado = Number(num1) / Number(num2);
    }
}

if (resultado != null){
    console.log(`O resultado da operação é ${resultado}`)
}
*/

const notas = [];
const alunos = [];

// inserir elementos nas listas
notas.push(5.6);
notas.push(4.0);
notas.push(6.7);

alunos.push('joão');
alunos.push('maria');
alunos.push('alfredo');

// console.log(notas, alunos);

// iteração
for (let aluno of alunos){
    console.log(`Nome: ${aluno}`);
}