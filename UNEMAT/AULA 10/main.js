console.log('aprendendo js');
/*
let nome = window.prompt('Qual é o seu nome?');
let idade = window.prompt('Qual é a sua idade?');

console.log(nome, typeof nome);
console.log(idade, typeof idade);

if (idade >= 18) {
    console.log('Você é maior de idade');
}
else {
    console.log('Você é menor de idade');
}
*/

let num1 = window.prompt('Digite um número:');
let num2 = window.prompt('Digite outro número:');

const operacao = window.prompt('Digite a operação desejada: +, -, *, /');

let resultado = NaN;

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
else{
    console.log('Operação inválida');
}
if (resultado != NaN){
    console.log(`O resultado da operação é ${resultado}`);
}