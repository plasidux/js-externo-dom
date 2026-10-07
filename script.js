/* ============================================================
   CAPTURA DOS ELEMENTOS DO DOM
   ============================================================ */

/*
    document.getElementById()

    Procura no HTML um elemento que possua
    determinado ID.

    Exemplo:

    HTML:
    <form id="form-tarefa">

    JavaScript:
    document.getElementById("form-tarefa")

    O resultado é armazenado na constante.
*/

const formTarefa = document.getElementById("form-tarefa");

const inputTarefa = document.getElementById("input-tarefa");

const listaTarefas = document.getElementById("lista-tarefas");

const erroMsg = document.getElementById("erro-msg");

const btnLimpar = document.getElementById("btn-limpar");

const btnTema = document.getElementById("btn-tema");

const contadorTarefas = document.getElementById('contador-tarefas');

const inputBusca = document.getElementById('input-busca');

// Evento executado sempre que o usuário digitar no campo de busca
inputBusca.addEventListener('input', () => {
    renderizarTarefas();
});

/* ============================================================
   ESTADO DA APLICAÇÃO
   ============================================================ */

/*
    Aqui armazenamos as tarefas.

    localStorage.getItem('tarefas_app')
    procura no navegador os dados salvos com essa chave.

    JSON.parse()
    transforma o texto salvo pelo localStorage
    novamente em um array/objeto JavaScript.

    || []
    significa:

    "Se não existir nenhuma tarefa salva,
    utilize um array vazio."
*/

let tarefas = JSON.parse(localStorage.getItem("tarefas_app")) || [];

/* ============================================================
   CONTADOR DE TAREFAS
   ============================================================ */

function atualizarContador() {

    /* quantidade total de tarefas */
    const total = tarefas.length;

    /* conta somente as tarefas que ainda não foram concluídas */
    const pendentes = tarefas.filter(t => !t.concluida).length;

    /* mostra as informações no HTML */
    contadorTarefas.textContent =
        `Total: ${total} | Pendentes: ${pendentes}`;
}

/* ============================================================
   1. INICIALIZAÇÃO
   ============================================================ */

/*
    DOMContentLoaded

    Este evento acontece quando o HTML
    terminou de ser carregado pelo navegador.

    Quando isso acontecer:

    1. carregamos o tema;
    2. mostramos as tarefas salvas.
*/

document.addEventListener("DOMContentLoaded", () => {
  carregarTema();

  renderizarTarefas();
});

/* ============================================================
   2. ESCUTADOR DO FORMULÁRIO
   ============================================================ */

/*
    addEventListener()

    Permite dizer ao JavaScript:

    "Quando determinado evento acontecer,
    execute esta função."

    Aqui estamos observando o evento "submit"
    do formulário.
*/

formTarefa.addEventListener("submit", (e) => {
  /*
        preventDefault()

        Impede o comportamento padrão do formulário.

        Sem isso, o navegador poderia recarregar
        a página quando o formulário fosse enviado.
    */
  e.preventDefault();

  /*
        Depois de impedir o comportamento padrão,
        chamamos nossa função para adicionar a tarefa.
    */
  adicionarTarefa();
});

/* ============================================================
   BOTÃO LIMPAR TODAS
   ============================================================ */

btnLimpar.addEventListener("click", () => {
  /*
        confirm()

        Mostra uma caixa de confirmação
        para o usuário.
    */
  if (confirm("Tem certeza que deseja apagar todas as tarefas?")) {
    /*
            Substituímos o array por um array vazio.
        */
    tarefas = [];

    /*
            Salvamos novamente e atualizamos a tela.
        */
    salvarERenderizar();
  }
});

/* ============================================================
   BOTÃO DE TEMA
   ============================================================ */

btnTema.addEventListener("click", () => {
  /*
        classList.toggle()

        Se "dark-mode" não existir no body,
        adiciona.

        Se já existir,
        remove.

        Assim conseguimos alternar
        entre tema claro e escuro.
    */
  document.body.classList.toggle("dark-mode");

  /*
        classList.contains()

        Verifica se o body possui a classe
        "dark-mode".

        O resultado será true ou false.
    */
  const eEscuro = document.body.classList.contains("dark-mode");

  /*
        Salva no LocalStorage se o tema escuro
        está ativado.
    */
  localStorage.setItem("tema_escuro", eEscuro);
});

/* ============================================================
   3. ADICIONAR TAREFA
   ============================================================ */

function adicionarTarefa() {
  /*
        .value

        Pega o conteúdo digitado no input.

        .trim()

        Remove espaços desnecessários
        no começo e no final do texto.
    */
  const texto = inputTarefa.value.trim();

  /*
        Verifica se o usuário não digitou nada.
    */
  if (texto === "") {
    /*
            Mostra a mensagem de erro
            diretamente no HTML.
        */
    erroMsg.textContent = "Por favor, digite uma descrição para a tarefa.";

    return;
  }

  /*
        Se chegou aqui, significa que
        existe um texto válido.

        Então limpamos a mensagem de erro.
    */
  erroMsg.textContent = "";

  /*
        Criamos um objeto representando
        uma nova tarefa.
    */
  const novaTarefa = {
    /*
            Date.now()

            Gera um número baseado na data/hora atual.

            Usaremos esse número como ID da tarefa.
        */
    id: Date.now(),

    /*
            Texto digitado pelo usuário.
        */
    texto: texto,

    /*
            A tarefa começa como não concluída.
        */
    concluida: false,

    /* Pega a data e hora atuais do computador no momento em que a tarefa é criada */
    criadaEm: new Date(),
  };

  /*
        .push()

        Adiciona a nova tarefa ao final
        do array "tarefas".
    */
  tarefas.push(novaTarefa);

  /*
        Salva os dados e atualiza a tela.
    */
  salvarERenderizar();

  /*
        Limpa o campo de texto depois
        que a tarefa foi cadastrada.
    */
  inputTarefa.value = "";

  /*
        Coloca o cursor novamente
        dentro do campo.
    */
  inputTarefa.focus();
}

/* ============================================================
   ALTERAR STATUS DA TAREFA
   ============================================================ */

function alternarStatus(id) {
  /*
        .map()

        Percorre todas as tarefas
        e cria um novo array.
    */
  tarefas = tarefas.map((t) => {
    /*
            Verifica se o ID da tarefa atual
            é igual ao ID recebido pela função.
        */
    if (t.id === id) {
      /*
                O operador !

                inverte um valor booleano:

                true  -> false
                false -> true

                Assim conseguimos marcar
                e desmarcar uma tarefa.
            */
      t.concluida = !t.concluida;
    }

    /*
            Retorna a tarefa para o novo array.
        */
    return t;
  });

  /*
        Salva e atualiza a tela.
    */
  salvarERenderizar();
}

/* ============================================================
   REMOVER TAREFA
   ============================================================ */

function removerTarefa(id) {
  /*
        .filter()

        Cria um novo array contendo
        somente os elementos que atendem
        à condição.

        Aqui:

        t.id !== id

        significa:

        "mantenha as tarefas cujo ID
        seja diferente do ID recebido."
    */
  tarefas = tarefas.filter((t) => t.id !== id);

  /*
        Salva os dados e atualiza a tela.
    */
  salvarERenderizar();
}

// Edita o texto de uma tarefa existente
function editarTarefa(id) {

    // Procura a tarefa pelo seu ID
    const tarefa = tarefas.find(t => t.id === id);

    // Se a tarefa não for encontrada, encerra a função
    if (!tarefa) return;

    // Abre uma caixa para o usuário informar o novo texto
    const novoTexto = prompt('Digite o novo texto da tarefa:', tarefa.texto);

    // Verifica se o usuário cancelou
    if (novoTexto === null) return;

    // Remove espaços desnecessários no início e no final
    const texto = novoTexto.trim();

    // Não permite salvar uma tarefa vazia
    if (texto === '') {
        alert('A tarefa não pode ficar vazia.');
        return;
    }

    // Atualiza o texto da tarefa
    tarefa.texto = texto;

    // Salva no LocalStorage e atualiza a tela
    salvarERenderizar();
}

/* ============================================================
   SALVAR E RENDERIZAR
   ============================================================ */

function salvarERenderizar() {
  /*
        localStorage.setItem()

        Salva uma informação no navegador.

        Primeiro argumento:
        nome da chave.

        Segundo argumento:
        valor que será salvo.
    */

  localStorage.setItem("tarefas_app", JSON.stringify(tarefas));

  /*
        Depois de salvar,
        atualizamos o conteúdo da tela.
    */
  renderizarTarefas();
}

/* ============================================================
   RENDERIZAR TAREFAS
   ============================================================ */

function renderizarTarefas() {
  /*
        innerHTML = ''

        Limpa a lista antes de reconstruí-la.
    */
  listaTarefas.innerHTML = "";

    /* Pega o texto digitado e transforma em letras minúsculas */
  const busca = inputBusca.value.toLowerCase();

   /* Filtra as tarefas de acordo com o texto pesquisado*/
  const tarefasfiltradas = tarefas.filter(t =>
    t.texto.toLowerCase().includes(busca)
  );

    // Coloca as tarefas concluídas no final da lista
    tarefasfiltradas.sort((a, b) => {
        return Number(a.concluida) - Number(b.concluida);
}); 


  /*
        Verifica se não existem tarefas.
    */
  if (tarefasfiltradas.length === 0) {
    /*
            Mostra uma mensagem na lista.
        */
    listaTarefas.innerHTML =
      "<li><small>Nenhuma tarefa cadastrada.</small></li>";

    return;
  }

  /*
        forEach()

        Percorre cada tarefa existente no array.
    */
  tarefasfiltradas.forEach((t) => {

    /*
            createElement()

            Cria um novo elemento HTML
            através do JavaScript.
        */
    const li = document.createElement("li");

    /*
            Se a tarefa estiver concluída,
            adicionamos a classe "concluida".
        */
    if (t.concluida) {
      li.classList.add("concluida");
    }

    /*
            Criamos um elemento <span>
            para armazenar o texto da tarefa.
        */
    const span = document.createElement("span");

     // Formata a data de criação da tarefa
    const dataCriacao = new Date(t.criadaEm);

    const dataFormatada = dataCriacao.toLocaleString("pt-BR");

      // Mostra o texto da tarefa e a data de criação
      span.innerHTML = `
        <strong>${t.texto}</strong>
        <br>
    <small>Criada em: ${dataFormatada}</small>
    `;

    /*
            Quando o usuário clicar no texto
            da tarefa, alternamos seu status.
        */
    span.addEventListener("click", () => {
      alternarStatus(t.id);
    });

    // Cria o botão de edição
const btnEditar = document.createElement('button');

// Texto exibido no botão
btnEditar.textContent = 'Editar';

// Evento executado quando o botão for clicado
btnEditar.addEventListener('click', () => {
    editarTarefa(t.id);
});

// Adiciona o botão à tarefa
li.appendChild(btnEditar);

    /*
            Criamos o botão de excluir.
        */
    const btnExcluir = document.createElement("button");

    /*
            Texto exibido no botão.
        */
    btnExcluir.textContent = "Excluir";

    /*
            Define a classe CSS do botão.
        */
    btnExcluir.className = "btn-remove";

    /*
            Quando o botão for clicado,
            chamamos removerTarefa().
        */
    btnExcluir.addEventListener("click", () => {
      removerTarefa(t.id);
    });

    /*
            appendChild()

            Adiciona elementos dentro de outro elemento.

            Aqui colocamos:

            span dentro do li
            botão dentro do li
        */
    li.appendChild(span);

    li.appendChild(btnExcluir);

    /*
            Finalmente colocamos o li
            dentro da lista <ul>.
        */
    listaTarefas.appendChild(li);
  });

    /* atualiza o contador depois de renderizar as tarefas */
    atualizarContador();
}

/* ============================================================
   CARREGAR TEMA
   ============================================================ */

function carregarTema() {
  /*
        Recupera do LocalStorage
        a informação sobre o tema.
    */
  const eEscuro = JSON.parse(localStorage.getItem("tema_escuro"));

  /*
        Se o valor recuperado for true,
        adicionamos a classe dark-mode.
    */
  if (eEscuro) {
    document.body.classList.add("dark-mode");
  }
}
