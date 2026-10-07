import { buscarTrilha, listarTrilhas, type Trilha } from "../utils/loader.js";

export function executarTrilha(tecnologia?: string): void {
  if (!tecnologia) {
    const trilhas = listarTrilhas();
    console.log("\n🌍 Geo-Explorer — Trilhas Disponíveis\n");
    console.log("═".repeat(50));
    for (const trilha of trilhas) {
      console.log(`  ${trilha.icone} ${trilha.nome.padEnd(30)} [${trilha.id}]`);
      console.log(`     ${trilha.descricao}`);
      console.log(`     ⏱️  Duração: ${trilha.duracao}`);
      console.log();
    }
    console.log(
      "💡 Use: node dist/commands/trilha.js <tecnologia> [nivel]\n" +
        "   Exemplo: node dist/commands/trilha.js javascript intermediario\n"
    );
    return;
  }

  const nivel = process.argv[3];
  const trilha = buscarTrilha(tecnologia);

  if (!trilha) {
    const disponiveis = listarTrilhas()
      .map((t) => t.id)
      .join(", ");
    console.error(
      `\n❌ Trilha "${tecnologia}" não encontrada.\n   Disponíveis: ${disponiveis}\n`
    );
    process.exit(1);
  }

  exibirTrilha(trilha, nivel);
}

function exibirTrilha(trilha: Trilha, nivel?: string): void {
  const separator = "═".repeat(60);
  const subSeparator = "─".repeat(60);

  console.log(`\n${separator}`);
  console.log(`  ${trilha.icone}  TRILHA: ${trilha.nome.toUpperCase()}`);
  console.log(separator);
  console.log(`\n📋 ${trilha.descricao}`);
  console.log(`⏱️  Duração estimada: ${trilha.duracao}`);
  console.log(`📊 Níveis: ${trilha.niveis.join(" → ")}`);

  const modulosExibir = nivel
    ? trilha.modulos.filter((m) => m.nivel === nivel.toLowerCase())
    : trilha.modulos;

  if (nivel && modulosExibir.length === 0) {
    console.error(
      `\n❌ Nível "${nivel}" não encontrado para esta trilha.\n   Disponíveis: ${trilha.niveis.join(", ")}\n`
    );
    process.exit(1);
  }

  for (const modulo of modulosExibir) {
    console.log(`\n${subSeparator}`);
    console.log(`  🎯 NÍVEL: ${modulo.nivel.toUpperCase()}`);
    console.log(`  📚 ${modulo.titulo}`);
    console.log(subSeparator);

    console.log("\n  📝 Tópicos:");
    for (const topico of modulo.topicos) {
      console.log(`     • ${topico}`);
    }

    console.log("\n  🛠️  Projetos Práticos:");
    for (const projeto of modulo.projetos) {
      console.log(`     ★ ${projeto}`);
    }

    console.log("\n  🔗 Recursos:");
    for (const recurso of modulo.recursos) {
      const badge = recurso.tipo.toUpperCase().padEnd(14);
      console.log(`     [${badge}] ${recurso.nome}`);
      console.log(`              ${recurso.url}`);
    }
  }

  console.log(`\n${separator}`);
  console.log(
    `  💡 Para um desafio desta trilha: node dist/commands/desafio.js ${trilha.id} <nivel>`
  );
  console.log(`${separator}\n`);
}

const tecnologia = process.argv[2];
executarTrilha(tecnologia);
