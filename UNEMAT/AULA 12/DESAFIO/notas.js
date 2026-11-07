const campoNome = document.querySelector("#nome");
const campoNota1 = document.querySelector("#nota1");
const campoNota2 = document.querySelector("#nota2");
const campoNota3 = document.querySelector("#nota3");
const calcular = document.querySelector("#botaoCalcular");
const campoResultado = document.querySelector("#resultado");

calcular.addEventListener("click", () => {
    const aluno = campoNome.value;
    const n1 = parseFloat(campoNota1.value);
    const n2 = parseFloat(campoNota2.value);
    const n3 = parseFloat(campoNota3.value);
    let situacao = '';

    const media = (n1 + n2 + n3) / 3
    if (media >= 6) situacao = 'aprovado';
    else if (media >= 4) situacao = 'recuperação';
    else situacao = 'reprovado';

    campoResultado.textContent = `${aluno} está ${situacao}, média: ${media}`
});