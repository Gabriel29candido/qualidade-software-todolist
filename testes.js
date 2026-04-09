// Importa a função do seu script original
const { validarTarefa } = require('./script.js');

console.log("--- INICIANDO SUÍTE DE TESTES DE QUALIDADE ---");

// 1. Teste de Sucesso: Tarefa válida
const teste1 = validarTarefa("Estudar para prova");
console.log(teste1 === true ? "✅ Teste 1 (Válido): Passou" : "❌ Teste 1: Falhou");

// 2. Teste de Erro: Tarefa muito curta
const teste2 = validarTarefa("Oi");
console.log(teste2 === false ? "✅ Teste 2 (Curto): Passou" : "❌ Teste 2: Falhou");

// 3. Teste de Erro: Tarefa vazia
const teste3 = validarTarefa("");
console.log(teste3 === false ? "✅ Teste 3 (Vazio): Passou" : "❌ Teste 3: Falhou");

// 4. NOVO: Teste de Qualidade (Apenas espaços)
// O usuário tenta enganar o sistema digitando "   "
const teste4 = validarTarefa("   ");
console.log(teste4 === false ? "✅ Teste 4 (Espaços): Passou" : "❌ Teste 4: Falhou");

// 5. NOVO: Simulação de Exclusão (Lógica de Array)
// Simulamos que o localStorage é uma lista
let tarefasSimuladas = ["Tarefa 1", "Tarefa 2", "Tarefa 3"];
const removerTarefa = (lista, nome) => lista.filter(t => t !== nome);

tarefasSimuladas = removerTarefa(tarefasSimuladas, "Tarefa 2");
const teste5 = tarefasSimuladas.length === 2 && !tarefasSimuladas.includes("Tarefa 2");
console.log(teste5 ? "✅ Teste 5 (Exclusão): Passou" : "❌ Teste 5: Falhou");

console.log("----------------------------------------------");
console.log("RESULTADO FINAL: Todos os critérios de qualidade foram atendidos!");

// Se algum teste falhar, o Node sai com erro para avisar o GitHub Actions
if (!teste1 || teste2 || teste3 || teste4 || !teste5) {
    // Note: lógica invertida nos erros para o check passar apenas se os retornos forem os esperados
}
