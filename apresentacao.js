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
const { formatarMoeda } = require("./utils");

module.exports = function gerarFaturaStr(fatura, calc) {
  const apresentacoes = fatura.apresentacoes;
  const dadosPecas = (apresentacoes || [])
    .map((apre) => calc.getDadosPecaStr(apre))
    .join("\n");

  return `Fatura ${fatura.cliente}
${dadosPecas}
Valor total: ${formatarMoeda(calc.calcularTotalFatura(apresentacoes))}
Créditos acumulados: ${calc.calcularTotalCreditos(apresentacoes)} `;
};
