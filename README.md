# 📝 To-Do List com Foco em Qualidade de Software

Este projeto é uma aplicação de lista de tarefas desenvolvida para a disciplina de **Qualidade de Software**. O objetivo principal foi implementar um fluxo de desenvolvimento moderno, utilizando testes automatizados e integração contínua (CI).

##  Link do Projeto
[🔗 Clique aqui para acessar o site oficial])(https://gabriel29candido.github.io/qualidade-software-todolist/)

---
## 🛠️ Tecnologias e Ferramentas de Qualidade
* **Lógica:** JavaScript (ES6+)
* **Testes Unitários:** Node.js (Ambiente de execução de testes)
* **CI/CD:** GitHub Actions (Automação de testes a cada commit)
* **Revisão de Código:** Integração com revisores de IA (Qodo Gen/CodeRabbit)
* **Hospedagem:** GitHub Pages

---

##  Suíte de Testes Automatizados
Implementamos 5 testes fundamentais no arquivo `testes.js` que são validados automaticamente pela nossa Pipeline:
1. **Tarefa Válida:** Garante que nomes com 3 ou mais caracteres sejam aceitos.
2. **Tarefa Curta:** Bloqueia nomes com menos de 3 caracteres.
3. **Tarefa Vazia:** Impede a inserção de strings nulas.
4. **Espaços em Branco:** Valida se o sistema limpa espaços inúteis (trim).
5. **Lógica de Exclusão:** Simula se a remoção de itens da lista está funcionando corretamente.

---

## 👥 Integrantes do Grupo
* **Gabriel Cândido**
* **Danyel Guerra Batista**

---
*Professor: Guilherme Augusto Ferraz*
