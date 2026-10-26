/* DESAFIO
    Crie um programa que o usuário digite 
    o ano de nascimento e o programa calcule
    se ele é maior de idade ou não.
    Pergunte o nome dele e a idade.
    Ao final responda com uma mensagem:
    "Olá, [nome], você tem [idade] anos e é maior de idade."
*/

console.log('Desafio JS');

let idade = window.prompt('Digite seu ano de nascimento: ');
idade = 2026 - Number(idade);

let nome = window.prompt('Digite seu nome: ');

if (idade >= 18){
    console.log(`Olá, ${nome}, você tem ${idade} anos e é maior de idade.`);
}
else{
    console.log(`Olá, ${nome}, você tem ${idade} anos e é menor de idade.`);
}