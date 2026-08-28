import { useState } from "react";
import { Modal } from "./Modal";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type Tab = "history" | "rules" | "dedication";

const HISTORY: string[] = [
  "O truco é um dos jogos de cartas mais populares do sul do Brasil, também muito jogado no Uruguai e na Argentina. A versão gaudéria é a do pampa gaúcho, berço da cultura tradicionalista.",
  "O jogo usa o baralho espanhol de 40 cartas, com quatro naipes: ouros, copas, espadas e bastos (\"paus\").",
  "Tradicionalmente é disputado \"de mano\" ou por duas equipes de dois ou três jogadores, o que explica o aviso: a partir de 18 pontos, se está jogando em trios, não tem mais testa que é a disputa direta entre 2 jogadores de cada time.",
  "Surgido nos pampas, o jogo mistura blefe, coragem e \"laranca\" (falar alto) para intimidar os adversários — características marcantes da cultura gaudéria.",
];

const DEDICATION: string[] = [
  "Esse jogo é dedicado ao bloco Irertnoc de Jaguari Rio Grande de Sul. E todos que gostam de fazer um churrasco, abrir uma cerveja e jogar um truco com muito grito e briga.",
];

type Rule = { title: string; paragraphs: string[] };

const RULES: Rule[] = [
  {
    title: "Como jogar",
    paragraphs: [
      "Pode ser jogado um contra um (\"de mano\"), ou em times com dois (\"de dupla\") ou três jogadores cada (\"trio\").",
      "Quando há quatro participantes, duas duplas são formadas e uma dupla joga contra a outra. O seu parceiro de jogo será a pessoa que estiver posicionada exatamente na sua frente.",
      "Quando há seis participantes, dois trios são formados e um trio joga contra o outro. Os participantes são posicionados na mesa intercalando entre adversário e companheiro.",
      "Assim como o Truco Paulista, o Truco Gaudério é disputado em mãos.",
      "No Truco Gaudério ocorre uma disputa preliminar ao início de cada mão conhecida como Envido (opcional, podendo não ser chamado). Com o Envido, pode-se aumentar o valor da mão.",
      "Caso algum participante tenha Flor (3 cartas do mesmo naipe), o Envido não pode ser chamado.",
      "A distribuição das cartas é feita de forma aleatória, como cada integrante recebe 3 cartas, quem vencer 2 rodadas de uma mão, ganha \"a volta\", onde vale primordialmente 1 ponto e pode ser incrementa ao chamar Truco.",
    ],
  },
  {
    title: "Formato do jogo",
    paragraphs: [
      "Jogadores: 2 (1 contra 1) conhecido como \"de mano\", 4 (2 contra 2) conhecido como \"de duplas\" ou 6 (3 contra 3) conhecido como \"de trios\".",
      "Número de cartas: 40 (retirando-se 8, 9, 10 e curingas).",
      "Distribuição: 3 cartas para cada participante.",
      "Objetivo: o jogador ou a equipe que atingir o total de pontos ganha a partida.",
    ],
  },
  {
    title: "Convenções",
    paragraphs: [
      "O baralho usado é o baralho espanhol.",
      "As cartas mais fortes são as \"4 que não se empardam\", 1 de espada, 1 de bastos (\"paus\"), 7 de espada e 7 de ouro, respectivamente.",
      "Na sequência vem os: 3, 2 e 1 (de todos os naipes). Seguidos de: 12, 11, 10, 7, 6, 5 e 4 (de todos os naipes).",
    ],
  },
  {
    title: "Envido",
    paragraphs: [
      "A soma dos pontos do envido se faz por 2 cartas do mesmo naipe, somando 20 pontos e ignorando os 10, 11 e 12.",
      "Exemplo de ter 4 e 5 de espadas, o jogador tem 20 + 4 + 5 pontos, resultando em 29 pontos de Envido.",
      "Se um jogador não tiver cartas do mesmo naipe, ele não poderá somar os 20 pontos.",
      "Exemplo de ter 4 de espadas, 5 de bastos e 3 de ouro, esse jogador tem 5 pontos de Envido.",
    ],
  },
  {
    title: "Definições",
    paragraphs: [
      "Mão — Fração da partida, vale 1 ponto e poderá ter seu valor aumentado através das disputas de Truco e Envido. É disputada em melhor de 3 rodadas.",
      "Rodada — É a fração da \"mão\"; em cada rodada os jogadores mostram uma carta.",
      "Falta — É a diferença entre o placar final do jogo e os pontos da pessoa que está ganhando.",
      "Empatar — Quando a maior carta de cada dupla, numa determinada rodada, tem o mesmo valor.",
      "Fechar Carta — Jogar a carta virada para a mesa, passando assim a não valer nada. Também chamado de carta \"coberta\" ou \"carta encoberta\".",
      "Ir ao baralho — Quando o jogador ou dupla foge da rodada, entregando os pontos de Truco para o jogador ou dupla adversária.",
    ],
  },
  {
    title: "Pontos obtidos na disputa de Truco",
    paragraphs: [
      "Truco — Disputa para aumentar o valor da \"mão\" para 2.",
      "Re-truco — Pode ser chamado na sequência do Truco, aumentando o valor da \"mão\" para 3.",
      "Vale 4 — Pode ser chamado na sequência do Re-truco, aumentando o valor da \"mão\" para 4.",
    ],
  },
  {
    title: "Pontos obtidos na disputa de Envido",
    paragraphs: [
      "Envido — Disputa paralela que ocorre durante a primeira rodada de uma mão para aumentar seu valor em até 2 pontos.",
      "Real Envido — Chamado na sequência do Envido, aumenta o valor dos pontos de Envido em até 5 pontos.",
      "Real Envido — Também pode ser chamado direto de começo, nesse caso vale 3 pontos de Envido.",
      "Falta Envido — Pode valer a virada, ou seja, chegar aos 12 pontos quando nenhum time ultrapassou esse valor ou a diferença entre o placar final do jogo e os pontos da pessoa que está ganhando, quando um time já passou dos 12 pontos.",
    ],
  },
  {
    title: "Empate",
    paragraphs: [
      "Em caso de empate, o vencedor é definido da seguinte forma:",
      "• Se empatar na primeira rodada, quem ganhar a segunda vence a mão;",
      "• Se empatar na segunda rodada, quem ganhou a primeira vence a mão;",
      "• Se empatar na primeira e segunda rodadas, quem ganhar a terceira vence a mão;",
      "• Se empatar na terceira rodada, quem ganhou a primeira vence a mão;",
      "• Se todas as três rodadas empatarem, quem iniciou a mão vence a mão.",
      "Quem chegar primeiro ao total de pontos (12 ou 24) ganha a partida. Caso ambos os times passem do total de pontos na mesma mão, ganha aquele que obtiver a pontuação mais alta.",
    ],
  },
  {
    title: "Truco",
    paragraphs: [
      "A grande característica e provavelmente o maior motivo da popularidade do jogo é o chamado Truco. Truco é o pedido de \"aumento de aposta\". A rodada que inicialmente vale 1 ponto pode passar a valer até 4 pontos.",
      "Quando um jogador pede Truco, o adversário pode: aceitar o pedido (a mão passa a valer 2 pontos); fugir, interrompendo a mão (e perdendo 1 ponto); pedir Retruco (elevando o valor da aposta para 3 pontos).",
      "Quando um jogador pede Retruco, o adversário pode: aceitar o pedido (a mão passa a valer 3 pontos); fugir, interrompendo a mão (e perdendo 2 pontos); pedir Vale 4 (elevando o valor da aposta para 4 pontos).",
      "Quando um jogador pede Vale 4, o adversário pode: aceitar o pedido (a mão passa a valer 4 pontos); fugir, interrompendo a mão (e perdendo 3 pontos).",
      "O Truco pode ser pedido em qualquer momento da partida. Contudo, apenas o time adversário pode pedir o aumento da aposta. Por exemplo, caso um jogador peça Truco e seu adversário aceite o pedido, apenas o próprio adversário poderá pedir Retruco durante o restante da mão.",
      "Os pontos de Truco são dados ao ganhador da mão.",
    ],
  },
  {
    title: "Envido",
    paragraphs: [
      "A disputa de Envido é o grande diferencial do Truco Gaudério para as demais modalidades de Truco e é basicamente mais uma forma de aumentar o valor da aposta da mão.",
      "Ao contrário dos pontos de Truco, os pontos de Envido não são dados ao ganhador da mão. O Envido é uma disputa paralela que tem como base a soma do valor das cartas de cada jogador.",
      "As cartas valem pelo número indicado: o Ás vale um ponto, o 2 vale dois pontos, o 3 vale três e assim por diante, até o 7. As cartas com figuras (10, 11 e 12) valem zero pontos. Além disso, a combinação de duas cartas do mesmo naipe dá direito a uma bonificação de vinte pontos, que deverão ser somados ao valor dessas duas cartas.",
      "Exemplo: as três cartas na mão do jogador são Ás de copas, 7 de copas e 6 de bastos (\"paus\"). Esse jogador tem duas cartas do mesmo naipe (20 pontos) mais 1 (Ás), mais 7 (sete), portanto possui 28 pontos.",
      "A pontuação mais alta é 33 (6 e 7 do mesmo naipe) e a mais baixa com cartas do mesmo naipe é 20 (duas figuras).",
      "Se todas forem de naipes diferentes, vale como pontuação o valor da mais alta. Exemplo: o jogador possui ás de bastos (\"paus\"), três de espadas e quatro de ouros, portanto possui 4 pontos.",
      "O Envido pode ser pedido apenas na primeira rodada de uma mão e o jogador não pode ter jogado nenhuma carta na mesa. Apesar de todos os jogadores participarem da disputa, em partidas com quatro jogadores, o Envido pode ser pedido apenas pelos dois últimos jogadores de uma rodada.",
      "Quando um jogador pede Envido, o adversário pode: aceitar o pedido (o vencedor ganha 2 pontos); fugir (o adversário perde 1 ponto); pedir Real Envido; pedir Falta Envido.",
      "Quando um jogador pede Real Envido, o adversário pode: aceitar o pedido (o vencedor ganha 3 pontos); fugir (o adversário perde 1 ponto); pedir Falta Envido.",
      "Quando um jogador pede Real Envido como resposta a um pedido de Envido, o adversário pode: aceitar o pedido (o vencedor ganha 5 pontos); fugir (o adversário perde 2 pontos); pedir Falta Envido.",
      "Quando um jogador pede Falta Envido, o adversário pode: aceitar o pedido (o vencedor ganha a \"Falta\"); fugir (o adversário perde 1 ponto).",
      "Quando um jogador pede Falta Envido como resposta a um pedido de Real Envido, o adversário pode: aceitar o pedido (o vencedor ganha a \"Falta\"); fugir (o adversário perde 5 pontos).",
    ],
  },
  {
    title: "Flor",
    paragraphs: [
      "A Flor é um caso especial de Envido em que um jogador tem três cartas do mesmo naipe e anula qualquer pedido de Envido, Real Envido ou Falta Envido feito anteriormente ou que alguém queira fazer.",
      "Quando um jogador pede Flor e o adversário também tem Flor, ele pode:",
      "Flor — Tipo especial de Envido em que o jogador deve ter 3 cartas do mesmo naipe. É possível aumentar o valor da mão em 3 pontos.",
      "Contra-flor — Uma das possíveis respostas ao pedido de Flor. Pode aumentar o valor da mão em 6 pontos. (Em algumas situações o valor pode ser maior)",
      "Contra-flor e o resto — Disputa similar à Contra-flor que pode aumentar o valor da mão para a diferença entre o placar final do jogo e os pontos da pessoa que está ganhando, além dos pontos da Contra-flor. (Em algumas situações o valor pode ser maior)",
    ],
  },
  {
    title: "Variações",
    paragraphs: [
      "O truco gaudério apresenta variações nas suas regras dependendo da região.",
      "Fique a vontade para aplicar mudanças, essa foi uma explicação generalista das regras do jogo.",
      "Ele envolve muita mentira, e regras mais específicas, como quem corta o baralho após ser embaralhado, pode ser SOMENTE o jogador adversário a esquerda, caso o jogador a direita corte pode ser cobrado 1 ponto.",
      "Erros na distribuição das cartas podem ocasionar em um ponto para o adversário",
      "Jogos de trios contam com uma rodada denominada \"testa\" até algum time chegar aos 18 pontos, essa disputa é o confronto individual entre 2 jogadores.",
      "No truco, as palavras são sagradas, se você falou alguma das palavras chaves como \"Truco\" ou \"Envido\", não é possível voltar atrás. Se você falou \"flor\" por exemplo, e não tem 3 cartas do mesmo naipe, caso o adversário peça para você mostrar e você não tem, ele automaticamente que ganha os 3 pontos da sua flor.",
    ],
  },
];

const TABS: { key: Tab; label: string }[] = [
  { key: "history", label: "História" },
  { key: "rules", label: "Regras" },
  { key: "dedication", label: "Dedicatória" },
];

export function RulesModal({ visible, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("history");

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      footer={
        <button type="button" className="t-btn t-btn-cta t-modal-close" onClick={onClose}>
          Fechar
        </button>
      }
    >
      <div className="t-modal-title">Sobre o jogo</div>
      <div className="t-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`t-tab ${item.key === tab ? "t-tab-active" : ""}`}
            role="tab"
            aria-selected={item.key === tab}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="t-modal-scroll">
        {tab === "history" ? (
          HISTORY.map((paragraph, index) => (
            <p key={index} className="t-modal-text">
              {paragraph}
            </p>
          ))
        ) : tab === "rules" ? (
          RULES.map((rule, index) => (
            <div key={index} className="t-rule">
              <div className="t-rule-title">{rule.title}</div>
              {rule.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="t-rule-text">
                  {paragraph}
                </p>
              ))}
            </div>
          ))
        ) : (
          DEDICATION.map((paragraph, index) => (
            <p key={index} className="t-modal-text">
              {paragraph}
            </p>
          ))
        )}
      </div>
    </Modal>
  );
}
