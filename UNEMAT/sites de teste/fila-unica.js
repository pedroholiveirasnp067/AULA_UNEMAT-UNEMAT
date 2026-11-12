const campoNome = document.querySelector("#nome-paciente");

const campoTela = document.querySelector("#tela");

const btnRetirarSenha = document.querySelector("#botaoRetirarSenha");
const btnAtender = document.querySelector("#botao-atender");
const btnMostrarFila = document.querySelector("#botao-mostrar-fila");

let fila = [];
const list_senhas = []

const removeIndex = (lista) => {
    lista = lista.reverse();
    lista.pop();
    lista.reverse();
    return ;
}

const sortSenha = () => {
    const senha = Math.floor(Math.random() * 999) + 1;
    
    if (senha in list_senhas) return sortSenha();
    else{
        list_senhas.push(senha);
        return senha;
    }
}

const addFila = (lista, nome, senha) => {
    lista.push([nome, senha]);
    return [nome, senha];
}

const mostraSenha = (dados) => `olá ${dados[0]}, sua senha é ${dados[1]}`

const atender = (lista) => {
    if (lista.length > 0){
        let nome = lista[0][0];
        let senha = lista[0][1];
        removeIndex(lista)
        removeIndex(list_senhas);

        campoTela.textContent = `
        ===== Nome: ${nome} | Senha: ${senha} =====`;
    }
    else{
        campoTela.textContent = 'fila vazia!';
    }
}

const mostrarFila = (lista) => {
    campoTela.textContent = '';

    if (lista.length > 0){
        let mensagem = '';
        for (let i = 0; i < (lista.length); i++){
            mensagem += `${lista[i][0]} : ${lista[i][1]} | `; 
        }
        campoTela.textContent = mensagem;
    }
    else{
        campoTela.textContent = 'fila vazia!';
    }
}

btnRetirarSenha.addEventListener("click", () => {
    const paciente = campoNome.value;
    
    if (paciente == ''){
        campoTela.textContent = 'Digite um nome!';
    }
    else{
        const senha = sortSenha();
        const dados = addFila(fila, paciente, senha);
        const mensagem = mostraSenha(dados);
        campoNome.value = '';
        campoTela.textContent = mensagem;
    }
});

btnAtender.addEventListener("click", () => {
    atender(fila);
});

btnMostrarFila.addEventListener("click", () => {
    mostrarFila(fila);
});