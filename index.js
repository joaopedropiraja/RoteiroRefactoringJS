const { readFileSync } = require("fs");

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

function calcularTotalApresentacao(pecas, apre) {
  let total = 0;
  switch (getPeca(pecas, apre).tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
  }

  return total;
}

function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia")
    creditos += Math.floor(apre.audiencia / 5);
  return creditos;
}

function calcularTotalFatura(pecas, apresentacoes) {
  return (apresentacoes || []).reduce(
    (acc, apre) => acc + calcularTotalApresentacao(pecas, apre),
    0
  );
}

function calcularTotalCreditos(pecas, apresentacoes) {
  return (apresentacoes || []).reduce(
    (acc, apre) => acc + calcularCredito(pecas, apre),
    0
  );
}

function getDadosPecaStr(pecas, apre) {
  return `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(
    calcularTotalApresentacao(pecas, apre)
  )} (${apre.audiencia} assentos)\n`;
}

function gerarFaturaStr(fatura, pecas) {
  const apresentacoes = fatura.apresentacoes;

  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += getDadosPecaStr(pecas, apre);
  }
  faturaStr += `Valor total: ${formatarMoeda(
    calcularTotalFatura(pecas, apresentacoes)
  )}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(
    pecas,
    apresentacoes
  )} \n`;
  return faturaStr;
}

function getDadosPecaHTML(pecas, apre) {
  return `\t<li>${getPeca(pecas, apre).nome}: ${formatarMoeda(
    calcularTotalApresentacao(pecas, apre)
  )} (${apre.audiencia} assentos) </li>`;
}

function gerarFaturaHTML(fatura, pecas) {
  const apresentacoes = fatura.apresentacoes;
  const dadosPecas = (apresentacoes || [])
    .map((apre) => getDadosPecaHTML(pecas, apre))
    .join("\n");

  return `<html>
    <p>Fatura ${fatura.cliente || "- Não especificado"}</p>
    <ul>
${dadosPecas}
    </ul>
    <p>Valor total: ${formatarMoeda(
      calcularTotalFatura(pecas, apresentacoes)
    )} </p>
    <p>Créditos acumulados: ${calcularTotalCreditos(pecas, apresentacoes)} </p>
  </html>`;
}

const faturas = JSON.parse(readFileSync("./faturas.json"));
const pecas = JSON.parse(readFileSync("./pecas.json"));
const faturaStr = gerarFaturaStr(faturas, pecas);
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaStr);
console.log(faturaHTML);
