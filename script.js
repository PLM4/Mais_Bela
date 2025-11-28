let dataAtual = new Date();
let diaSelecionado = null;
let horarioSelecionado = null;

const NUMERO_WHATSAPP = "5583987483877";
const NOME_PROFISSIONAL = "Marcella";

const horariosIndisponiveis = {
  "2024-01-20": ["10:00", "14:00"],
  "2024-01-22": ["09:00", "11:00", "15:00"],
};

const configuracao = {
  diasSemana: {
    inicio: 9,
    fim: 17,
  },
  sabado: {
    inicio: 8,
    fim: 14,
  },
  domingo: {
    inicio: 13,
    fim: 16,
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carrossel-track");
  const cards = document.querySelectorAll(".trabalho-card");
  const prevBtn = document.querySelector(".carrossel-btn.prev");
  const nextBtn = document.querySelector(".carrossel-btn.next");
  const indicadoresContainer = document.querySelector(".carrossel-indicadores");

  let currentIndex = 0;
  const cardsPerView = getCardsPerView();

  cards.forEach((_, index) => {
    const indicador = document.createElement("button");
    indicador.className = "indicador";
    if (index === 0) indicador.classList.add("ativo");
    indicador.addEventListener("click", () => goToSlide(index));
    indicadoresContainer.appendChild(indicador);
  });

  function getCardsPerView() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateCarrossel() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const translateX = -currentIndex * cardWidth;
    track.style.transform = `translateX(${translateX}px)`;

    document.querySelectorAll(".indicador").forEach((ind, index) => {
      ind.classList.toggle("ativo", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarrossel();
  }

  function nextSlide() {
    const maxIndex = cards.length - getCardsPerView();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarrossel();
  }

  function prevSlide() {
    const maxIndex = cards.length - getCardsPerView();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarrossel();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  window.addEventListener("resize", function () {
    currentIndex = 0;
    updateCarrossel();
  });

  const modal = document.getElementById("modal-trabalho");
  const imagemModal = document.getElementById("imagem-modal");
  const fecharModal = document.getElementById("fechar-modal");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const imagemSrc = this.querySelector("img").src;
      const imagemAlt = this.querySelector("img").alt;

      imagemModal.src = imagemSrc;
      imagemModal.alt = imagemAlt;
      modal.classList.add("ativo");
      document.body.style.overflow = "hidden";
    });
  });

  fecharModal.addEventListener("click", function () {
    modal.classList.remove("ativo");
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("ativo");
      document.body.style.overflow = "auto";
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("ativo")) {
      modal.classList.remove("ativo");
      document.body.style.overflow = "auto";
    }
  });

  updateCarrossel();
});

document.addEventListener("DOMContentLoaded", function () {
  const trabalhoCards = document.querySelectorAll(".trabalho-card");
  const modal = document.getElementById("modal-trabalho");
  const imagemModal = document.getElementById("imagem-modal");
  const fecharModal = document.getElementById("fechar-modal");

  trabalhoCards.forEach((card) => {
    card.addEventListener("click", function () {
      const imagemSrc = this.querySelector("img").src;
      const imagemAlt = this.querySelector("img").alt;

      imagemModal.src = imagemSrc;
      imagemModal.alt = imagemAlt;
      modal.classList.add("ativo");
      document.body.style.overflow = "hidden";
    });
  });

  fecharModal.addEventListener("click", function () {
    modal.classList.remove("ativo");
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("ativo");
      document.body.style.overflow = "auto";
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("ativo")) {
      modal.classList.remove("ativo");
      document.body.style.overflow = "auto";
    }
  });
});

function formatarDataParaChave(data) {
  return data.toISOString().split("T")[0];
}

function horarioEstaIndisponivel(data, horario) {
  const dataChave = formatarDataParaChave(data);
  return (
    horariosIndisponiveis[dataChave] &&
    horariosIndisponiveis[dataChave].includes(horario)
  );
}

function getConfiguracaoDia(data) {
  const diaSemana = data.getDay();

  if (diaSemana === 6) {
    return configuracao.sabado;
  } else if (diaSemana === 0) {
    return configuracao.domingo;
  } else {
    return configuracao.diasSemana;
  }
}

function marcarHorarioComoIndisponivel(data, horario) {
  const dataChave = formatarDataParaChave(data);

  if (!horariosIndisponiveis[dataChave]) {
    horariosIndisponiveis[dataChave] = [];
  }

  if (!horariosIndisponiveis[dataChave].includes(horario)) {
    horariosIndisponiveis[dataChave].push(horario);
  }

  try {
    localStorage.setItem(
      "horariosIndisponiveis",
      JSON.stringify(horariosIndisponiveis)
    );
  } catch (e) {
    console.log("Não foi possível salvar no localStorage");
  }
}

function carregarHorariosIndisponiveis() {
  try {
    const salvos = localStorage.getItem("horariosIndisponiveis");
    if (salvos) {
      Object.assign(horariosIndisponiveis, JSON.parse(salvos));
    }
  } catch (e) {
    console.log("Não foi possível carregar do localStorage");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  carregarHorariosIndisponiveis();
  gerarCalendario(dataAtual);

  document.getElementById("prev-month").addEventListener("click", function () {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    gerarCalendario(dataAtual);
  });

  document.getElementById("next-month").addEventListener("click", function () {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    gerarCalendario(dataAtual);
  });

  document
    .getElementById("agendamento-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      enviarAgendamento();
    });
});

function enviarAgendamento() {
  if (horarioEstaIndisponivel(diaSelecionado, horarioSelecionado)) {
    alert(
      "❌ Este horário já foi agendado por outra cliente. Por favor, escolha outro horário."
    );
    mostrarHorarios();
    return;
  }

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;
  const servico = document.getElementById("servico").value;

  const dataFormatada = diaSelecionado.toLocaleDateString("pt-BR");

  const mensagem = `📅 *NOVO AGENDAMENTO* 📅
            
 *Cliente:* ${nome}
 *Telefone:* ${telefone}
 *Endereco:* ${endereco}

 *Data:* ${dataFormatada}
 *Horário:* ${horarioSelecionado}
 *Serviço:* ${servico}

_Agendamento realizado via site_`;

  const mensagemCodificada = encodeURIComponent(mensagem);

  const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensagemCodificada}`;

  marcarHorarioComoIndisponivel(diaSelecionado, horarioSelecionado);

  window.open(urlWhatsApp, "_blank");

  const notificacao = document.getElementById("notificacao");
  notificacao.innerHTML =
    "Agendamento realizado! Redirecionando para o WhatsApp...";
  notificacao.classList.add("ativo");

  document.getElementById("agendamento-form").reset();
  document.getElementById("form-agendamento").classList.remove("ativo");

  setTimeout(function () {
    notificacao.classList.remove("ativo");
  }, 5000);
}

function gerarCalendario(data) {
  const calendario = document.getElementById("calendario");
  const mesAno = document.querySelector(".mes-ano");

  calendario.innerHTML = "";

  const opcoes = { month: "long", year: "numeric" };
  mesAno.textContent = data.toLocaleDateString("pt-BR", opcoes);

  const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
  const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0);
  const primeiroDiaSemana = primeiroDia.getDay();

  const ultimoDiaMesAnterior = new Date(
    data.getFullYear(),
    data.getMonth(),
    0
  ).getDate();

  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const dia = document.createElement("div");
    dia.className = "dia desabilitado";
    dia.textContent = ultimoDiaMesAnterior - i;
    calendario.appendChild(dia);
  }

  for (let i = 1; i <= ultimoDia.getDate(); i++) {
    const dia = document.createElement("div");
    dia.className = "dia";
    dia.textContent = i;

    const dataDia = new Date(data.getFullYear(), data.getMonth(), i);
    const diaSemana = dataDia.getDay();

    const configDia = getConfiguracaoDia(dataDia);
    const horariosDisponiveis = calcularHorariosDisponiveis(dataDia);

    if (horariosDisponiveis.length === 0) {
      dia.classList.add("desabilitado");
      dia.title = "Dia sem horários disponíveis";
    } else {
      dia.addEventListener("click", function () {
        selecionarDia(this, dataDia);
      });
      dia.title = "Clique para ver horários disponíveis";
    }

    calendario.appendChild(dia);
  }

  const totalDias = 42;
  const diasRestantes = totalDias - (primeiroDiaSemana + ultimoDia.getDate());

  for (let i = 1; i <= diasRestantes; i++) {
    const dia = document.createElement("div");
    dia.className = "dia desabilitado";
    dia.textContent = i;
    calendario.appendChild(dia);
  }

  diaSelecionado = null;
  horarioSelecionado = null;
  document.getElementById("horarios-container").style.display = "none";
  document.getElementById("form-agendamento").classList.remove("ativo");
}

function calcularHorariosDisponiveis(data) {
  const configDia = getConfiguracaoDia(data);
  const horariosDisponiveis = [];

  for (let hora = configDia.inicio; hora < configDia.fim; hora++) {
    const horario = `${hora}:00`;

    if (!horarioEstaIndisponivel(data, horario)) {
      horariosDisponiveis.push(horario);
    }
  }

  return horariosDisponiveis;
}

function selecionarDia(elemento, data) {
  const diasSelecionados = document.querySelectorAll(".dia.selecionado");
  diasSelecionados.forEach((dia) => dia.classList.remove("selecionado"));

  elemento.classList.add("selecionado");
  diaSelecionado = data;

  mostrarHorarios();
}

function mostrarHorarios() {
  const horariosContainer = document.getElementById("horarios-container");
  const listaHorarios = document.getElementById("lista-horarios");

  listaHorarios.innerHTML = "";

  const horariosDisponiveis = calcularHorariosDisponiveis(diaSelecionado);

  if (horariosDisponiveis.length === 0) {
    listaHorarios.innerHTML =
      '<p style="text-align: center; color: #e91e63; grid-column: 1 / -1;">Nenhum horário disponível para esta data</p>';
  } else {
    horariosDisponiveis.forEach((horario) => {
      const horarioElement = document.createElement("div");
      horarioElement.className = "horario";
      horarioElement.textContent = horario;

      horarioElement.addEventListener("click", function () {
        const horariosSelecionados = document.querySelectorAll(
          ".horario.selecionado"
        );
        horariosSelecionados.forEach((h) => h.classList.remove("selecionado"));

        this.classList.add("selecionado");
        horarioSelecionado = this.textContent;

        document.getElementById("form-agendamento").classList.add("ativo");
      });

      listaHorarios.appendChild(horarioElement);
    });
  }

  horariosContainer.style.display = "block";
}
