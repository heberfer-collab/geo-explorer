import { buscarDesafio, buscarTrilha, listarTrilhas } from "../utils/loader.js";

const NIVEIS_VALIDOS = ["iniciante", "intermediario", "avancado"];

export function executarDesafio(tecnologia?: string, nivel?: string): void {
  if (!tecnologia) {
    const trilhas = listarTrilhas();
    console.log("\n🌍 Geo-Explorer — Gerador de Desafios\n");
    console.log("═".repeat(50));
    console.log("\nUso: node dist/commands/desafio.js <tecnologia> <nivel>\n");
    console.log("Tecnologias disponíveis:");
    for (const t of trilhas) {
      console.log(`  ${t.icone} ${t.id.padEnd(15)} — ${t.nome}`);
    }
    console.log("\nNíveis disponíveis: iniciante | intermediario | avancado");
    console.log(
      "\nExemplo: node dist/commands/desafio.js javascript intermediario\n"
    );
    return;
  }

  if (!nivel) {
    console.error(
      `\n❌ Informe o nível. Uso: node dist/commands/desafio.js ${tecnologia} <nivel>\n` +
        `   Níveis: ${NIVEIS_VALIDOS.join(", ")}\n`
    );
    process.exit(1);
  }

  const nivelLower = nivel.toLowerCase();

  if (!NIVEIS_VALIDOS.includes(nivelLower)) {
    console.error(
      `\n❌ Nível "${nivel}" inválido.\n   Válidos: ${NIVEIS_VALIDOS.join(", ")}\n`
    );
    process.exit(1);
  }

  const trilha = buscarTrilha(tecnologia);
  if (!trilha) {
    const disponiveis = listarTrilhas()
      .map((t) => t.id)
      .join(", ");
    console.error(
      `\n❌ Tecnologia "${tecnologia}" não encontrada.\n   Disponíveis: ${disponiveis}\n`
    );
    process.exit(1);
  }

  const desafio = buscarDesafio(tecnologia, nivelLower);

  if (!desafio) {
    console.error(
      `\n❌ Nenhum desafio encontrado para ${tecnologia} nível ${nivelLower}.\n`
    );
    process.exit(1);
  }

  const separator = "═".repeat(60);
  const subSeparator = "─".repeat(60);

  console.log(`\n${separator}`);
  console.log(
    `  🏆  DESAFIO ${nivelLower.toUpperCase()} — ${trilha.icone} ${trilha.nome.toUpperCase()}`
  );
  console.log(separator);

  console.log(`\n  📌 ${desafio.titulo}`);
  console.log(`\n${subSeparator}`);

  console.log("\n  📄 Descrição:");
  console.log(`     ${desafio.descricao}`);

  console.log("\n  📥 Entrada de exemplo:");
  console.log(`     ${desafio.exemplo_entrada}`);

  console.log("\n  📤 Saída esperada:");
  console.log(`     ${desafio.exemplo_saida}`);

  console.log("\n  💡 Dica:");
  console.log(`     ${desafio.dica}`);

  console.log(`\n${subSeparator}`);
  console.log("  📝 Template de código:");
  console.log(subSeparator);
  const linhasTemplate = desafio.template.split("\n");
  for (const linha of linhasTemplate) {
    console.log(`     ${linha}`);
  }

  console.log(`\n${separator}`);
  console.log(
    `  🎯 Ao concluir: node dist/commands/certificado.js "${trilha.id}" "Seu Nome"`
  );
  console.log(`${separator}\n`);
}

const tecnologia = process.argv[2];
const nivel = process.argv[3];
executarDesafio(tecnologia, nivel);
