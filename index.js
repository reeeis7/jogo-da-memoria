const tabuleiro = document.getElementById("game-board");
const visorTempo = document.getElementById("timer");
const visorPontos = document.getElementById("score");

const somAcerto = new Audio("acerto.mp3");
const somErro = new Audio("erro.mp3");

let icones = ["🍕", "🍔", "🍟", "🌭", "🥞", "🍩", "🍣", "🍜"];

let cartas = [];
let travarJogo = false;
let pontuacao = 0;
let tempoRestante = 60;
let intervaloTempo = null;
let totalPares = icones.length;
let paresEncontrados = 0;
let primeiraCarta = null;
let segundaCarta = null;

function iniciarJogo() {
  cartas = duplicarIcones(icones);
  embaralharCartas(cartas);
  criarCartasNoTabuleiro(cartas);
  iniciarContadorRegressivo();
}

function duplicarIcones(lista) {
  let pares = [];
  for (let i = 0; i < lista.length; i++) {
    pares.push(lista[i]);
    pares.push(lista[i]);
  }
  return pares;
}

function embaralharCartas(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    let cartaSorteada = Math.floor(Math.random() * (i + 1));
    let temp = lista[i];
    lista[i] = lista[cartaSorteada];
    lista[cartaSorteada] = temp;
  }
}

function criarCartasNoTabuleiro(listaCarta) {
  tabuleiro.innerHTML = "";
  for (let i = 0; i < listaCarta.length; i++) {
    let carta = document.createElement("div");
    carta.classList.add("card");
    carta.dataset.icon = listaCarta[i];
    carta.addEventListener("click", function () {
      virarCarta(carta);
    });
    tabuleiro.appendChild(carta);
  }
}

function iniciarContadorRegressivo() {
  visorTempo.textContent = tempoRestante;
  intervaloTempo = setInterval(function () {
    tempoRestante--;
    visorTempo.textContent = tempoRestante;

    if (tempoRestante <= 0) {
      clearInterval(intervaloTempo);
      alert("Fim de jogo! O tempo acabou.");
      travarJogo = true;
    }
  }, 1000);
}

function virarCarta(carta) {
  if (
    travarJogo ||
    carta.classList.contains("card-revealed") ||
    carta === primeiraCarta
  ) {
    return;
  }

  carta.textContent = carta.dataset.icon;
  carta.classList.add("card-revealed");

  if (!primeiraCarta) {
    primeiraCarta = carta;
    return;
  }

  segundaCarta = carta;
  travarJogo = true;

  verificarPares();
}

function esconderCartas() {
  primeiraCarta.textContent = "";
  segundaCarta.textContent = "";
  primeiraCarta.classList.remove("card-revealed");
  segundaCarta.classList.remove("card-revealed");
  limparCartasSelecionadas();
}

limparCartasSelecionadas = function () {
  primeiraCarta = null;
  segundaCarta = null;
  travarJogo = false;
};

function verificarPares() {
  if (primeiraCarta.dataset.icon === segundaCarta.dataset.icon) {
    somAcerto.play();
    paresEncontrados++;
    pontuacao += 10;
    visorPontos.textContent = pontuacao;
    limparCartasSelecionadas();

    if (paresEncontrados === totalPares) {
      clearInterval(intervaloTempo);
      alert("Parabéns! Você encontrou todos os pares!");
    }
  } else {
    somErro.play();
    setTimeout(esconderCartas, 1000);
  }
}

function resetarJogo() {
  clearInterval(intervaloTempo);
  pontuacao = 0;
  tempoRestante = 60;
  paresEncontrados = 0;
  visorPontos.textContent = pontuacao;
  travarJogo = false;
  primeiraCarta = null;
  segundaCarta = null;
  iniciarJogo();
}

iniciarJogo();
