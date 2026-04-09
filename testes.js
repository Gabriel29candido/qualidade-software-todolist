// testes.js
const { validarTarefa } = require('./script.js');

console.log("Iniciando testes de qualidade...");

const casos = [
    { entrada: "Comprar leite", esperado: true },
    { entrada: "Oi", esperado: false }, // Curto demais
    { entrada: "   ", esperado: false }  // Apenas espaços
];

casos.forEach((teste, index) => {
    const resultado = validarTarefa(teste.entrada);
    if (resultado === teste.esperado) {
        console.log(`✅ Teste ${index + 1} passou!`);
    } else {
        console.log(`❌ Teste ${index + 1} falhou! Entrada: "${teste.entrada}"`);
        process.exit(1); // Isso faz a Pipeline do GitHub ficar VERMELHA
    }
});
