// DESAFIO 

const numero_sort = Math.floor(Math.random() *20) +1;
let numero_user = 0;
let contagem_tentativas = 0;
const numeros_digitados = [];

while(numero_user != numero_sort){
    numero_user = Number(prompt('digite um número entre 1 e 20: '));
    contagem_tentativas++;
    numeros_digitados.push(numero_user);

    if (numero_user == numero_sort){
        console.log(`Parabéns, você acertou!
Número: ${numero_sort}
Tentativas: ${contagem_tentativas}
Números tentativas: ${numeros_digitados}`);
    }
}
