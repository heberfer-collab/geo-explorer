#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ── Tipos ────────────────────────────────────────────────────────────────────

interface Recurso {
  tipo: string;
  nome: string;
  url: string;
}

interface Modulo {
  nivel: string;
  titulo: string;
  topicos: string[];
  projetos: string[];
  recursos: Recurso[];
}

interface Trilha {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  duracao: string;
  niveis: string[];
  modulos: Modulo[];
}

interface Desafio {
  titulo: string;
  descricao: string;
  exemplo_entrada: string;
  exemplo_saida: string;
  dica: string;
  template: string;
}

interface TracksData {
  trilhas: Trilha[];
  desafios: Record<string, Record<string, Desafio[]>>;
}

// ── Carregamento de dados ─────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../../data/tracks.json");

let _cache: TracksData | null = null;

function carregarDados(): TracksData {
  if (_cache) return _cache;
  const conteudo = readFileSync(DATA_PATH, "utf-8");
  _cache = JSON.parse(conteudo) as TracksData;
  return _cache;
}

function buscarTrilha(id: string): Trilha | undefined {
  return carregarDados().trilhas.find(
    (t) => t.id.toLowerCase() === id.toLowerCase()
  );
}

function buscarDesafio(tecnologia: string, nivel: string): Desafio | undefined {
  const dados = carregarDados();
  const desafiosTec = dados.desafios[tecnologia.toLowerCase()];
  if (!desafiosTec) return undefined;
  const lista = desafiosTec[nivel.toLowerCase()];
  if (!lista || lista.length === 0) return undefined;
  return lista[Math.floor(Math.random() * lista.length)];
}

function gerarIdCertificado(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "GEO-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ── Servidor MCP ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "geo-explorer",
  version: "1.0.0",
});

// Tool: listar trilhas
server.tool(
  "listar_trilhas",
  "Lista todas as trilhas de aprendizagem disponíveis no Geo-Explorer",
  {},
  async () => {
    const dados = carregarDados();
    const linhas = dados.trilhas.map(
      (t) =>
        `${t.icone} **${t.nome}** (id: \`${t.id}\`)\n   ${t.descricao}\n   ⏱️ Duração: ${t.duracao} | Níveis: ${t.niveis.join(", ")}`
    );
    return {
      content: [
        {
          type: "text",
          text: `# 🌍 Trilhas disponíveis no Geo-Explorer\n\n${linhas.join("\n\n")}`,
        },
      ],
    };
  }
);

// Tool: obter trilha
server.tool(
  "obter_trilha",
  "Retorna o plano de estudos completo de uma trilha de aprendizagem específica",
  {
    tecnologia: z
      .string()
      .describe(
        "ID da tecnologia (ex: javascript, python, typescript, react, nodejs, devops)"
      ),
    nivel: z
      .string()
      .optional()
      .describe(
        "Nível desejado: iniciante, intermediario ou avancado (opcional — retorna todos se omitido)"
      ),
  },
  async ({ tecnologia, nivel }) => {
    const trilha = buscarTrilha(tecnologia);
    if (!trilha) {
      const ids = carregarDados()
        .trilhas.map((t) => t.id)
        .join(", ");
      return {
        content: [
          {
            type: "text",
            text: `❌ Trilha "${tecnologia}" não encontrada.\nDisponíveis: ${ids}`,
          },
        ],
        isError: true,
      };
    }

    const modulos = nivel
      ? trilha.modulos.filter((m) => m.nivel === nivel.toLowerCase())
      : trilha.modulos;

    if (nivel && modulos.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Nível "${nivel}" não encontrado para ${trilha.nome}.\nDisponíveis: ${trilha.niveis.join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    let texto = `# ${trilha.icone} Trilha: ${trilha.nome}\n\n`;
    texto += `${trilha.descricao}\n\n`;
    texto += `⏱️ **Duração:** ${trilha.duracao}\n`;
    texto += `📊 **Níveis:** ${trilha.niveis.join(" → ")}\n\n`;

    for (const modulo of modulos) {
      texto += `---\n## 🎯 Nível: ${modulo.nivel.toUpperCase()}\n### ${modulo.titulo}\n\n`;
      texto += `**📝 Tópicos:**\n${modulo.topicos.map((t) => `- ${t}`).join("\n")}\n\n`;
      texto += `**🛠️ Projetos práticos:**\n${modulo.projetos.map((p) => `- ${p}`).join("\n")}\n\n`;
      texto += `**🔗 Recursos:**\n${modulo.recursos.map((r) => `- [${r.nome}](${r.url}) *(${r.tipo})*`).join("\n")}\n\n`;
    }

    return { content: [{ type: "text", text: texto }] };
  }
);

// Tool: gerar desafio
server.tool(
  "gerar_desafio",
  "Gera um desafio de código para uma tecnologia e nível específicos",
  {
    tecnologia: z
      .string()
      .describe("ID da tecnologia (ex: javascript, python, typescript)"),
    nivel: z
      .string()
      .describe("Nível do desafio: iniciante, intermediario ou avancado"),
  },
  async ({ tecnologia, nivel }) => {
    const trilha = buscarTrilha(tecnologia);
    if (!trilha) {
      const ids = carregarDados()
        .trilhas.map((t) => t.id)
        .join(", ");
      return {
        content: [
          {
            type: "text",
            text: `❌ Tecnologia "${tecnologia}" não encontrada.\nDisponíveis: ${ids}`,
          },
        ],
        isError: true,
      };
    }

    const desafio = buscarDesafio(tecnologia, nivel);
    if (!desafio) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Nenhum desafio encontrado para ${tecnologia} nível ${nivel}.`,
          },
        ],
        isError: true,
      };
    }

    const texto =
      `# 🏆 Desafio ${nivel.toUpperCase()} — ${trilha.icone} ${trilha.nome}\n\n` +
      `## 📌 ${desafio.titulo}\n\n` +
      `**Descrição:** ${desafio.descricao}\n\n` +
      `**Entrada de exemplo:** \`${desafio.exemplo_entrada}\`\n\n` +
      `**Saída esperada:** \`${desafio.exemplo_saida}\`\n\n` +
      `**💡 Dica:** ${desafio.dica}\n\n` +
      `**📝 Template:**\n\`\`\`\n${desafio.template}\n\`\`\``;

    return { content: [{ type: "text", text: texto }] };
  }
);

// Tool: gerar certificado
server.tool(
  "gerar_certificado",
  "Gera os dados de um certificado fictício de conclusão de trilha",
  {
    trilha_id: z
      .string()
      .describe("ID da trilha concluída (ex: javascript, python)"),
    nome_aluno: z.string().describe("Nome completo do aluno"),
    nivel: z
      .string()
      .optional()
      .describe("Nível concluído (opcional, padrão: completo)"),
  },
  async ({ trilha_id, nome_aluno, nivel }) => {
    const trilha = buscarTrilha(trilha_id);
    if (!trilha) {
      const ids = carregarDados()
        .trilhas.map((t) => t.id)
        .join(", ");
      return {
        content: [
          {
            type: "text",
            text: `❌ Trilha "${trilha_id}" não encontrada.\nDisponíveis: ${ids}`,
          },
        ],
        isError: true,
      };
    }

    const id = gerarIdCertificado();
    const nivelFinal = nivel ?? "completo";
    const dataEmissao = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const texto =
      `# 🎓 Certificado de Conclusão\n\n` +
      `**⚠️ Este é um certificado fictício para fins educacionais.**\n\n` +
      `---\n\n` +
      `🌍 **Geo-Explorer Learning Platform** certifica que\n\n` +
      `## ${nome_aluno}\n\n` +
      `concluiu com êxito a trilha de aprendizagem\n\n` +
      `### ${trilha.icone} ${trilha.nome}\n\n` +
      `**Nível:** ${nivelFinal}\n` +
      `**Duração:** ${trilha.duracao}\n` +
      `**Data de emissão:** ${dataEmissao}\n` +
      `**Código:** \`${id}\`\n\n` +
      `---\n\n` +
      `*Para gerar o certificado em HTML, use: \`node dist/commands/certificado.js ${trilha_id} "${nome_aluno}" ${nivelFinal}\`*`;

    return { content: [{ type: "text", text: texto }] };
  }
);

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🌍 Geo-Explorer MCP Server rodando via stdio");
}

main().catch((error: unknown) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
