/**
 * Testes automatizados do Geo-Explorer
 * Executar com: npx tsx tests/geo-explorer.test.ts
 */

import { strict as assert } from "assert";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Helpers ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(nome: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✅ ${nome}`);
    passed++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  ❌ ${nome}`);
    console.log(`     ${msg}`);
    failed++;
  }
}

function descricao(grupo: string): void {
  console.log(`\n📦 ${grupo}`);
}

// ── Carrega dados ─────────────────────────────────────────────────────────────

const dataPath = join(__dirname, "../data/tracks.json");
const dados = JSON.parse(readFileSync(dataPath, "utf-8"));

// ── Testes: Estrutura dos dados ───────────────────────────────────────────────

descricao("Estrutura do arquivo de dados");

test("arquivo tracks.json existe e é JSON válido", () => {
  assert.ok(dados, "dados devem existir");
});

test("contém array 'trilhas' com pelo menos 1 trilha", () => {
  assert.ok(Array.isArray(dados.trilhas), "trilhas deve ser array");
  assert.ok(dados.trilhas.length >= 1, "deve ter pelo menos 1 trilha");
});

test("contém objeto 'desafios'", () => {
  assert.ok(
    typeof dados.desafios === "object",
    "desafios deve ser um objeto"
  );
});

test("cada trilha possui os campos obrigatórios", () => {
  for (const trilha of dados.trilhas) {
    assert.ok(trilha.id, `trilha deve ter id: ${JSON.stringify(trilha)}`);
    assert.ok(trilha.nome, `trilha ${trilha.id} deve ter nome`);
    assert.ok(trilha.descricao, `trilha ${trilha.id} deve ter descricao`);
    assert.ok(trilha.icone, `trilha ${trilha.id} deve ter icone`);
    assert.ok(trilha.duracao, `trilha ${trilha.id} deve ter duracao`);
    assert.ok(
      Array.isArray(trilha.niveis),
      `trilha ${trilha.id} deve ter array niveis`
    );
    assert.ok(
      Array.isArray(trilha.modulos),
      `trilha ${trilha.id} deve ter array modulos`
    );
  }
});

test("cada módulo possui tópicos, projetos e recursos", () => {
  for (const trilha of dados.trilhas) {
    for (const modulo of trilha.modulos) {
      assert.ok(
        Array.isArray(modulo.topicos) && modulo.topicos.length > 0,
        `${trilha.id}/${modulo.nivel} deve ter tópicos`
      );
      assert.ok(
        Array.isArray(modulo.projetos) && modulo.projetos.length > 0,
        `${trilha.id}/${modulo.nivel} deve ter projetos`
      );
      assert.ok(
        Array.isArray(modulo.recursos) && modulo.recursos.length > 0,
        `${trilha.id}/${modulo.nivel} deve ter recursos`
      );
    }
  }
});

// ── Testes: Loader ────────────────────────────────────────────────────────────

descricao("Funções do loader (src/utils/loader)");

const { carregarDados, buscarTrilha, listarTrilhas, buscarDesafio } =
  await import("../dist/utils/loader.js");

test("carregarDados retorna os dados corretamente", () => {
  const resultado = carregarDados();
  assert.ok(resultado.trilhas, "deve retornar trilhas");
  assert.ok(resultado.desafios, "deve retornar desafios");
});

test("listarTrilhas retorna todas as trilhas", () => {
  const trilhas = listarTrilhas();
  assert.ok(Array.isArray(trilhas), "deve retornar array");
  assert.equal(trilhas.length, dados.trilhas.length, "quantidade deve bater");
});

test("buscarTrilha('javascript') encontra a trilha corretamente", () => {
  const trilha = buscarTrilha("javascript");
  assert.ok(trilha, "deve encontrar a trilha");
  assert.equal(trilha.id, "javascript");
  assert.ok(trilha.nome.toLowerCase().includes("javascript"));
});

test("buscarTrilha é case-insensitive", () => {
  const t1 = buscarTrilha("JavaScript");
  const t2 = buscarTrilha("JAVASCRIPT");
  const t3 = buscarTrilha("javascript");
  assert.ok(t1 && t2 && t3, "deve encontrar independente do case");
  assert.equal(t1.id, t3.id);
  assert.equal(t2.id, t3.id);
});

test("buscarTrilha retorna undefined para trilha inexistente", () => {
  const resultado = buscarTrilha("cobol-mainframe-x9");
  assert.equal(resultado, undefined);
});

test("buscarDesafio retorna desafio válido para javascript/iniciante", () => {
  const desafio = buscarDesafio("javascript", "iniciante");
  assert.ok(desafio, "deve retornar desafio");
  assert.ok(desafio.titulo, "deve ter título");
  assert.ok(desafio.descricao, "deve ter descrição");
  assert.ok(desafio.template, "deve ter template");
  assert.ok(desafio.dica, "deve ter dica");
});

test("buscarDesafio retorna undefined para tecnologia inexistente", () => {
  const resultado = buscarDesafio("cobol", "iniciante");
  assert.equal(resultado, undefined);
});

test("buscarDesafio retorna undefined para nível inexistente", () => {
  const resultado = buscarDesafio("javascript", "ninja");
  assert.equal(resultado, undefined);
});

test("todos os níveis válidos têm desafios em pelo menos uma tecnologia", () => {
  const niveis = ["iniciante", "intermediario", "avancado"];
  for (const nivel of niveis) {
    const desafio = buscarDesafio("javascript", nivel);
    assert.ok(desafio, `deve ter desafio para nível: ${nivel}`);
  }
});

// ── Testes: Comando certificado ───────────────────────────────────────────────

descricao("Gerador de certificados (src/commands/certificado)");

const { gerarCertificadoHTML } = await import(
  "../dist/commands/certificado.js"
);

test("gerarCertificadoHTML retorna HTML válido", () => {
  const html = gerarCertificadoHTML("Maria Silva", "javascript", "intermediario");
  assert.ok(html.includes("<!DOCTYPE html>"), "deve ser HTML");
  assert.ok(html.includes("Maria Silva"), "deve conter nome do aluno");
  assert.ok(
    html.toLowerCase().includes("javascript"),
    "deve conter a tecnologia"
  );
  assert.ok(html.includes("Intermediario"), "deve conter o nível");
  assert.ok(html.includes("GEO-"), "deve conter código do certificado");
});

test("gerarCertificadoHTML contém aviso de documento fictício", () => {
  const html = gerarCertificadoHTML("João Santos", "python", "avancado");
  assert.ok(
    html.toLowerCase().includes("fictício") ||
      html.toLowerCase().includes("educacional"),
    "deve conter aviso de certificado fictício"
  );
});

test("gerarCertificadoHTML lança erro para trilha inexistente", () => {
  assert.throws(
    () => gerarCertificadoHTML("Teste", "trilha-inexistente", "iniciante"),
    /não encontrada/i
  );
});

test("gerarCertificadoHTML gera IDs únicos", () => {
  const html1 = gerarCertificadoHTML("Aluno A", "javascript", "iniciante");
  const html2 = gerarCertificadoHTML("Aluno B", "javascript", "iniciante");
  const id1 = html1.match(/GEO-[A-Z0-9]{8}/)?.[0];
  const id2 = html2.match(/GEO-[A-Z0-9]{8}/)?.[0];
  assert.ok(id1, "deve ter ID no certificado 1");
  assert.ok(id2, "deve ter ID no certificado 2");
  assert.notEqual(id1, id2, "IDs devem ser diferentes");
});

// ── Testes: Validações de negócio ─────────────────────────────────────────────

descricao("Validações de negócio");

test("todas as trilhas têm exatamente os 3 níveis padrão", () => {
  const niveisEsperados = ["iniciante", "intermediario", "avancado"];
  for (const trilha of dados.trilhas) {
    for (const nivel of niveisEsperados) {
      assert.ok(
        trilha.niveis.includes(nivel),
        `trilha ${trilha.id} deve incluir nível ${nivel}`
      );
    }
  }
});

test("IDs das trilhas são únicos", () => {
  const ids = dados.trilhas.map((t: { id: string }) => t.id);
  const unicos = new Set(ids);
  assert.equal(unicos.size, ids.length, "todos os IDs de trilha devem ser únicos");
});

test("todos os recursos têm URL e nome", () => {
  for (const trilha of dados.trilhas) {
    for (const modulo of trilha.modulos) {
      for (const recurso of modulo.recursos) {
        assert.ok(recurso.url, `recurso em ${trilha.id}/${modulo.nivel} deve ter URL`);
        assert.ok(recurso.nome, `recurso em ${trilha.id}/${modulo.nivel} deve ter nome`);
      }
    }
  }
});

test("desafios têm campos obrigatórios preenchidos", () => {
  for (const [tec, niveis] of Object.entries(dados.desafios)) {
    for (const [nivel, desafios] of Object.entries(
      niveis as Record<string, unknown[]>
    )) {
      for (const desafio of desafios as Array<Record<string, string>>) {
        assert.ok(desafio.titulo, `${tec}/${nivel}: desafio sem título`);
        assert.ok(desafio.descricao, `${tec}/${nivel}: desafio sem descrição`);
        assert.ok(desafio.template, `${tec}/${nivel}: desafio sem template`);
        assert.ok(desafio.dica, `${tec}/${nivel}: desafio sem dica`);
      }
    }
  }
});

// ── Resultado ─────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${"═".repeat(45)}`);
console.log(`  Resultado: ${passed}/${total} testes passaram`);
if (failed > 0) {
  console.log(`  ❌ ${failed} teste(s) falharam`);
  process.exit(1);
} else {
  console.log(`  ✅ Todos os testes passaram!`);
}
console.log(`${"═".repeat(45)}\n`);
