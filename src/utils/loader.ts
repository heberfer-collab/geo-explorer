import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface Recurso {
  tipo: string;
  nome: string;
  url: string;
}

export interface Modulo {
  nivel: string;
  titulo: string;
  topicos: string[];
  projetos: string[];
  recursos: Recurso[];
}

export interface Trilha {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  duracao: string;
  niveis: string[];
  modulos: Modulo[];
}

export interface Desafio {
  titulo: string;
  descricao: string;
  exemplo_entrada: string;
  exemplo_saida: string;
  dica: string;
  template: string;
}

export interface TracksData {
  trilhas: Trilha[];
  desafios: Record<string, Record<string, Desafio[]>>;
}

let _cache: TracksData | null = null;

export function carregarDados(): TracksData {
  if (_cache) return _cache;
  const caminho = join(__dirname, "../../data/tracks.json");
  const conteudo = readFileSync(caminho, "utf-8");
  _cache = JSON.parse(conteudo) as TracksData;
  return _cache;
}

export function buscarTrilha(id: string): Trilha | undefined {
  const dados = carregarDados();
  return dados.trilhas.find((t) => t.id.toLowerCase() === id.toLowerCase());
}

export function listarTrilhas(): Trilha[] {
  return carregarDados().trilhas;
}

export function buscarDesafio(
  tecnologia: string,
  nivel: string
): Desafio | undefined {
  const dados = carregarDados();
  const desafiosTec = dados.desafios[tecnologia.toLowerCase()];
  if (!desafiosTec) return undefined;
  const desafiosNivel = desafiosTec[nivel.toLowerCase()];
  if (!desafiosNivel || desafiosNivel.length === 0) return undefined;
  const indice = Math.floor(Math.random() * desafiosNivel.length);
  return desafiosNivel[indice];
}
