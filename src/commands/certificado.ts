import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { buscarTrilha, listarTrilhas } from "../utils/loader.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function gerarIdCertificado(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "GEO-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function gerarCertificadoHTML(
  nomeAluno: string,
  trilhaId: string,
  nivel: string
): string {
  const trilha = buscarTrilha(trilhaId);
  if (!trilha) {
    throw new Error(`Trilha "${trilhaId}" não encontrada`);
  }

  const id = gerarIdCertificado();
  const dataEmissao = formatarData(new Date());
  const nivelFormatado =
    nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase();

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificado — ${nomeAluno} — ${trilha.nome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: #f0f0e8;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .certificado {
      background: #ffffff;
      width: 900px;
      min-height: 620px;
      border: 3px solid #1a1a2e;
      position: relative;
      padding: 0;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    }
    .borda-decorativa {
      position: absolute;
      inset: 10px;
      border: 1.5px solid #b8960c;
      pointer-events: none;
    }
    .borda-interna {
      position: absolute;
      inset: 16px;
      border: 1px solid #d4af37;
      pointer-events: none;
    }
    .conteudo {
      padding: 56px 72px;
      text-align: center;
    }
    .cabecalho {
      margin-bottom: 2rem;
    }
    .logo {
      font-size: 2.8rem;
      margin-bottom: 0.5rem;
    }
    .titulo-app {
      font-family: 'Arial', sans-serif;
      font-size: 0.9rem;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 1.8rem;
    }
    .linha-dourada {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, #b8960c, #d4af37, #b8960c);
      margin: 0 auto 1.8rem;
    }
    .certificado-titulo {
      font-size: 0.75rem;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 1rem;
    }
    .certifica-texto {
      font-size: 1rem;
      color: #555;
      margin-bottom: 0.6rem;
    }
    .nome-aluno {
      font-size: 2.6rem;
      color: #1a1a2e;
      font-style: italic;
      margin: 0.3rem 0 1.2rem;
      border-bottom: 2px solid #d4af37;
      display: inline-block;
      padding-bottom: 0.3rem;
      min-width: 300px;
    }
    .conclusao-texto {
      font-size: 1rem;
      color: #555;
      margin-bottom: 0.4rem;
    }
    .trilha-nome {
      font-size: 1.7rem;
      color: #1a1a2e;
      font-weight: bold;
      margin: 0.4rem 0;
    }
    .nivel-badge {
      display: inline-block;
      background: #1a1a2e;
      color: #d4af37;
      font-family: 'Arial', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 0.3rem 1.2rem;
      border-radius: 2px;
      margin: 0.8rem 0 1.8rem;
    }
    .rodape {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0d8;
    }
    .assinatura {
      text-align: center;
    }
    .linha-assinatura {
      width: 160px;
      height: 1px;
      background: #333;
      margin: 0 auto 0.3rem;
    }
    .assinatura-nome {
      font-size: 0.8rem;
      color: #333;
      font-weight: bold;
    }
    .assinatura-cargo {
      font-size: 0.72rem;
      color: #888;
    }
    .info-certificado {
      text-align: right;
      font-family: 'Arial', sans-serif;
    }
    .info-certificado p {
      font-size: 0.72rem;
      color: #999;
      margin-bottom: 0.2rem;
    }
    .info-certificado .id {
      font-size: 0.8rem;
      color: #555;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
    }
    .nota-ficticia {
      font-family: 'Arial', sans-serif;
      font-size: 0.65rem;
      color: #ccc;
      text-align: center;
      margin-top: 1rem;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="certificado">
    <div class="borda-decorativa"></div>
    <div class="borda-interna"></div>
    <div class="conteudo">
      <div class="cabecalho">
        <div class="logo">🌍</div>
        <div class="titulo-app">Geo-Explorer Learning Platform</div>
        <div class="linha-dourada"></div>
      </div>

      <div class="certificado-titulo">Certificado de Conclusão</div>
      <p class="certifica-texto">Certificamos que</p>
      <div class="nome-aluno">${nomeAluno}</div>
      <p class="conclusao-texto">concluiu com êxito a trilha de aprendizagem</p>
      <div class="trilha-nome">${trilha.icone} ${trilha.nome}</div>
      <div class="nivel-badge">Nível ${nivelFormatado}</div>
      <p class="certifica-texto">Duração estimada: ${trilha.duracao}</p>

      <div class="rodape">
        <div class="assinatura">
          <div class="linha-assinatura"></div>
          <div class="assinatura-nome">Geo-Explorer</div>
          <div class="assinatura-cargo">Plataforma de Aprendizagem</div>
        </div>
        <div class="info-certificado">
          <p>Data de emissão</p>
          <p><strong>${dataEmissao}</strong></p>
          <p style="margin-top: 0.5rem">Código</p>
          <p class="id">${id}</p>
        </div>
      </div>
      <p class="nota-ficticia">Documento fictício gerado para fins educacionais</p>
    </div>
  </div>
</body>
</html>`;
}

export function executarCertificado(
  trilhaId?: string,
  nomeAluno?: string,
  nivel?: string
): void {
  if (!trilhaId || !nomeAluno) {
    const trilhas = listarTrilhas();
    console.log("\n🌍 Geo-Explorer — Gerador de Certificados\n");
    console.log("═".repeat(55));
    console.log(
      "\nUso: node dist/commands/certificado.js <trilha> <nome> [nivel]\n"
    );
    console.log("Exemplos:");
    console.log(
      '  node dist/commands/certificado.js javascript "Maria Silva" intermediario'
    );
    console.log('  node dist/commands/certificado.js python "João Santos"');
    console.log("\nTrilhas disponíveis:");
    for (const t of trilhas) {
      console.log(`  ${t.icone} ${t.id}`);
    }
    console.log();
    return;
  }

  const nivelFinal = nivel ?? "completo";

  const trilha = buscarTrilha(trilhaId);
  if (!trilha) {
    const disponiveis = listarTrilhas()
      .map((t) => t.id)
      .join(", ");
    console.error(
      `\n❌ Trilha "${trilhaId}" não encontrada.\n   Disponíveis: ${disponiveis}\n`
    );
    process.exit(1);
  }

  const html = gerarCertificadoHTML(nomeAluno, trilhaId, nivelFinal);

  const nomeArquivo = `certificado_${trilhaId}_${nomeAluno
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")}_${Date.now()}.html`;

  const pastaCerts = join(__dirname, "../../certificates");
  mkdirSync(pastaCerts, { recursive: true });
  const caminhoArquivo = join(pastaCerts, nomeArquivo);
  writeFileSync(caminhoArquivo, html, "utf-8");

  const separator = "═".repeat(55);
  console.log(`\n${separator}`);
  console.log(`  🎓  CERTIFICADO GERADO COM SUCESSO!`);
  console.log(separator);
  console.log(`\n  👤 Aluno: ${nomeAluno}`);
  console.log(`  ${trilha.icone} Trilha: ${trilha.nome}`);
  console.log(`  📊 Nível: ${nivelFinal}`);
  console.log(`\n  📄 Arquivo: certificates/${nomeArquivo}`);
  console.log(
    "\n  💡 Abra o arquivo HTML no navegador para visualizar o certificado."
  );
  console.log(`\n${separator}\n`);
}

const trilhaId = process.argv[2];
const nomeAluno = process.argv[3];
const nivel = process.argv[4];
executarCertificado(trilhaId, nomeAluno, nivel);
