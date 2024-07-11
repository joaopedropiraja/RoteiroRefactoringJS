const { readFileSync } = require("fs");

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync("./pecas.json"));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}
class ServicoCalculoFatura {
  constructor(repo) {
    this.repo = repo;
  }

  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPeca(apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }

  calcularTotalCreditos(apresentacoes) {
    return (apresentacoes || []).reduce(
      (acc, apre) => acc + this.calcularCredito(apre),
      0
    );
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (this.repo.getPeca(apre).tipo) {
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
        throw new Error(`Peça desconhecia: ${this.repo.getPeca(apre).tipo}`);
    }

    return total;
  }

  calcularTotalFatura(apresentacoes) {
    return (apresentacoes || []).reduce(
      (acc, apre) => acc + this.calcularTotalApresentacao(apre),
      0
    );
  }

  getDadosPecaStr(apre) {
    return `  ${this.repo.getPeca(apre).nome}: ${formatarMoeda(
      this.calcularTotalApresentacao(apre)
    )} (${apre.audiencia} assentos)`;
  }
}

function gerarFaturaStr(fatura, calc) {
  const apresentacoes = fatura.apresentacoes;
  const dadosPecas = (apresentacoes || [])
    .map((apre) => calc.getDadosPecaStr(apre))
    .join("\n");

  return `Fatura ${fatura.cliente}
${dadosPecas}
Valor total: ${formatarMoeda(calc.calcularTotalFatura(apresentacoes))}
Créditos acumulados: ${calc.calcularTotalCreditos(apresentacoes)} `;
}

// function getDadosPecaHTML(pecas, apre) {
//   return `\t<li>${getPeca(pecas, apre).nome}: ${formatarMoeda(
//     calcularTotalApresentacao(pecas, apre)
//   )} (${apre.audiencia} assentos) </li>`;
// }

// function gerarFaturaHTML(fatura, pecas) {
//   const apresentacoes = fatura.apresentacoes;
//   const dadosPecas = (apresentacoes || [])
//     .map((apre) => getDadosPecaHTML(pecas, apre))
//     .join("\n");

//   return `<html>
//     <p>Fatura ${fatura.cliente || "- Não especificado"}</p>
//     <ul>
// ${dadosPecas}
//     </ul>
//     <p>Valor total: ${formatarMoeda(
//       calcularTotalFatura(pecas, apresentacoes)
//     )} </p>
//     <p>Créditos acumulados: ${calcularTotalCreditos(pecas, apresentacoes)} </p>
//   </html>`;
// }

const faturas = JSON.parse(readFileSync("./faturas.json"));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

// const faturaHTML = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHTML);
