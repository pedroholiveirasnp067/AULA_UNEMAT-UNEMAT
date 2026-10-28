const calcMedia = (notas) => {
    let media = 0;
    for (let nota of notas){
        media += nota;
    }
    media = media / notas.length;
    return media
}

const situacao = (media) => {
    let resultado = 'Reprovado';
    if (media >= 6) resultado = 'Aprovado';
    else if (media >= 4) resultado = 'Recuperação';

    return resultado;
}

const lista_notas = []
let nota = 0

while (isNaN(nota) == false){
    nota = parseFloat(prompt('digite a nota: '));
    console.log(nota)
    if (isNaN(nota) == false) lista_notas.push(nota);
}