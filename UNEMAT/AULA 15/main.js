const form = document.querySelector('#formulario');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const nome = form.nome.value;
    const nomeCompleto = nome.split(' ');
    if (nome == '' 
        || nomeCompleto.length < 2 
        || nomeCompleto[1] == ''
        || /[0-9]/.test(nome)){
        alert('Por favor, preencha seu nome corretamente.');
        form.nome.focus()
        return;
    }

    const dataNascimento = form.nascimento.value;
    const dataValida = /^(?:(?:(?:0[1-9]|[12]\d|3[01])\/(?:0[13578]|1[02])|(?:0[1-9]|[12]\d|30)\/(?:0[469]|11)|(?:0[1-9]|1\d|2[0-8])\/02)\/\d{4}|29\/02\/(?:\d{2}(?:0[48]|[2468][048]|[13579][26])|(?:[02468][048]|[13579][26])00))$/;
    if (dataNascimento == ''
        || !dataValida.test(dataNascimento)
    ) {
        alert('Por favor, informe sua data de nascimento no formato dd/mm/aaaa.');
        form.nascimento.focus();
        return;
    }

    const email = form.email.value;
    if (email == ''
        || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ){
        alert('Por favor, informe seu email.');
        form.email.focus();
        return;
    }
});