# 🌍 Geo-Explorer

> Plataforma de exploração de trilhas de aprendizagem com desafios de código e certificados fictícios.

---

## O que é o Geo-Explorer?

O **Geo-Explorer** é um projeto de portfólio desenvolvido como parte de um desafio prático. Ele simula uma plataforma de aprendizagem que permite:

- **Explorar trilhas de estudo** para diferentes tecnologias (JavaScript, Python, TypeScript, React, Node.js e DevOps)
- **Receber desafios de código** personalizados por tecnologia e nível
- **Gerar certificados fictícios** em HTML para trilhas concluídas
- **Expor todos os recursos via Servidor MCP**, permitindo integração com ferramentas como IBM Bob

O projeto é construído com **TypeScript** puro, sem frameworks pesados, focando em clareza e simplicidade.

---

## Estrutura do projeto

```
geo-explorer/
├── data/
│   └── tracks.json          # Base de dados com trilhas e desafios
├── src/
│   ├── commands/
│   │   ├── trilha.ts        # Comando: exibe trilha de aprendizagem
│   │   ├── desafio.ts       # Comando: gera desafio de código
│   │   └── certificado.ts   # Comando: gera certificado fictício HTML
│   └── utils/
│       └── loader.ts        # Utilitário de leitura/busca nos dados
├── mcp/
│   └── src/
│       └── index.ts         # Servidor MCP com 4 tools expostas
├── tests/
│   └── geo-explorer.test.ts # Testes automatizados
├── certificates/            # Certificados HTML gerados (ignorados no git)
├── docs/                    # Documentação adicional
├── tsconfig.json
└── package.json
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior
- npm v8 ou superior

---

## Como executar o projeto

### 1. Clone o repositório e instale as dependências

```bash
git clone <url-do-repositório>
cd geo-explorer
npm install
```

### 2. Compile o TypeScript

```bash
npm run build
```

---

## Como usar os comandos

### 🗺️ Trilha — Plano de estudos

Exibe todas as trilhas disponíveis:

```bash
node dist/commands/trilha.js
```

Exibe a trilha completa de uma tecnologia:

```bash
node dist/commands/trilha.js javascript
node dist/commands/trilha.js python
```

Filtra por nível específico:

```bash
node dist/commands/trilha.js typescript intermediario
node dist/commands/trilha.js react avancado
```

**Tecnologias disponíveis:** `javascript`, `python`, `typescript`, `react`, `nodejs`, `devops`  
**Níveis disponíveis:** `iniciante`, `intermediario`, `avancado`

---

### 🏆 Desafio — Desafio de código

Exibe a ajuda com tecnologias e níveis:

```bash
node dist/commands/desafio.js
```

Gera um desafio aleatório:

```bash
node dist/commands/desafio.js javascript iniciante
node dist/commands/desafio.js python intermediario
node dist/commands/desafio.js typescript avancado
```

---

### 🎓 Certificado — Certificado fictício

Exibe a ajuda:

```bash
node dist/commands/certificado.js
```

Gera um certificado HTML na pasta `certificates/`:

```bash
node dist/commands/certificado.js javascript "Maria Silva" intermediario
node dist/commands/certificado.js python "João Santos"
node dist/commands/certificado.js devops "Ana Costa" avancado
```

> O arquivo HTML gerado pode ser aberto no navegador para visualizar o certificado formatado.

---

## Como executar os testes

### Pré-requisito: compile o projeto antes de rodar os testes

```bash
npm run build
```

### Rodar os testes

```bash
npx tsx tests/geo-explorer.test.ts
```

Os testes cobrem:

- ✅ Estrutura e integridade do arquivo `data/tracks.json`
- ✅ Funções do loader (`carregarDados`, `listarTrilhas`, `buscarTrilha`, `buscarDesafio`)
- ✅ Gerador de certificados HTML
- ✅ Validações de negócio (IDs únicos, campos obrigatórios, níveis consistentes)

---

## Servidor MCP

O Geo-Explorer inclui um **servidor MCP** (Model Context Protocol) que expõe os recursos da plataforma para ferramentas como o IBM Bob.

### Compilar o servidor MCP

```bash
cd mcp
npm install
npm run build
```

### Tools disponíveis no servidor MCP

| Tool | Descrição |
|------|-----------|
| `listar_trilhas` | Lista todas as trilhas disponíveis |
| `obter_trilha` | Retorna o plano de estudos de uma trilha |
| `gerar_desafio` | Gera um desafio de código por tecnologia e nível |
| `gerar_certificado` | Gera dados de certificado fictício |

### Registrar no IBM Bob (mcp.json)

Após compilar, registre o servidor no arquivo de configuração MCP do Bob:

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "node",
      "args": ["/caminho/absoluto/para/geo-explorer/mcp/build/index.js"]
    }
  }
}
```

> Substitua `/caminho/absoluto/para/geo-explorer` pelo caminho real na sua máquina.

---

## Melhorias realizadas

- **6 trilhas** com 3 níveis cada, cobrindo JavaScript, Python, TypeScript, React, Node.js e DevOps
- **Desafios reais** com templates de código, dicas e exemplos de entrada/saída para cada tecnologia
- **Certificado em HTML** com design profissional, código único gerado aleatoriamente e aviso de documento fictício
- **Servidor MCP completo** com 4 tools que expõem toda a funcionalidade da plataforma
- **Testes sem dependências externas** usando apenas o módulo nativo `assert` do Node.js
- **TypeScript estrito** com tipagem completa em todos os módulos

---

## O que aprendi durante o desafio

- **Protocolo MCP (Model Context Protocol):** Como criar um servidor MCP com TypeScript que expõe tools para agentes de IA, incluindo o tratamento correto de erros com `isError: true` para que o agente possa se auto-corrigir
- **Design de dados JSON:** Estruturar dados de forma que sejam consultáveis eficientemente sem banco de dados
- **TypeScript modular:** Separar responsabilidades em módulos com interfaces bem definidas e exportações explícitas
- **Testes sem frameworks:** Escrever testes legíveis usando apenas `assert` nativo do Node.js, sem adicionar dependências desnecessárias
- **Geração de HTML programático:** Produzir documentos HTML a partir de dados, com design responsivo apenas com CSS inline

---

## ⚠️ Aviso

Os certificados gerados por este projeto são **fictícios** e têm **fins exclusivamente educacionais**. Não representam qualificações reais.

---

*Projeto desenvolvido como portfólio para o desafio Geo-Explorer — DIO.*
