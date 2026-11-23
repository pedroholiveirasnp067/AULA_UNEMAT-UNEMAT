const divResposta = document.querySelector("#resposta");
const imgResposta = document.querySelector("#imagem");

const responder = async() => {
    divResposta.textContent = "Carregando...";
    imgResposta.src = "";
    const response = await fetch('https://yesno.wtf/api');
    const data = await response.json();
    divResposta.textContent = data.answer.replace('yes', 'sim').replace('no', 'não');
    imgResposta.src = data.image;
    imgResposta.style.display = "block";
    zerar();
}
const zerar = () => {
    setTimeout(() => {
        imgResposta.style.display = 'none';
        divResposta.textContent = '';
    }, 10000);
}