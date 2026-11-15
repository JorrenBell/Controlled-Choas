// Controlled Chaos v0.2
// This first prototype uses a simple local rule system: no AI or account required.
// new inferface


const $ = id => document.getElementById(id);

const players = [
  { name: "Player 1", score: 0 },
  { name: "Player 2", score: 0 }
];

const prompts = [
  "Name something that can fly.",
  "Name something found underwater.",
  "Name something associated with space."
];

let mode = "";
let round = 0;
let turn = 0;
let answers = [];
let chain = [];
let chaos = 10;
let finished = false;

$("rushBtn").onclick = () => startGame("rush");
$("chainBtn").onclick = () => startGame("chain");
$("menuBtn").onclick = showMenu;
$("nextBtn").onclick = nextRound;

$("answerForm").onsubmit = event => {
  event.preventDefault();
  submitAnswer();
};

function startGame(selectedMode) {
  mode = selectedMode;
  round = 0;
  turn = 0;
  answers = [];
  chain = [];
  chaos = 10;
  finished = false;

  players.forEach(player => player.score = 0);

  $("menu").hidden = true;
  $("game").hidden = false;
  $("modeTitle").textContent =
    mode === "rush" ? "⚡ Chaos Rush" : "🔗 Chaos Chain";

  renderRound();
}

function renderRound() {
  $("roundInfo").textContent = `Round ${round + 1} of 3`;
  $("prompt").textContent = mode === "rush"
    ? prompts[round]
    : chain.length === 0
      ? "Start a chain with any concept."
      : `Connect a new concept to: ${chain.at(-1)}`;

  $("turnInfo").textContent =
    `${players[turn].name}'s turn`;

  $("answer").value = "";
  $("answerForm").hidden = false;
  $("nextBtn").hidden = true;
  $("reveal").textContent = "";

  renderChaos();
  renderChain();
  renderLeaderboard();
}

function submitAnswer() {
  const answer = $("answer").value.trim();
  if (!answer || finished) return;

  answers.push({
    player: turn,
    text: answer
  });

  if (mode === "chain") {
    chain.push(answer);
    $("reveal").textContent =
      `${players[turn].name} added: ${answer}`;
  } else {
    $("reveal").textContent =
      "Answer locked! Pass the device to the next player.";
  }

  $("answer").value = "";

  if (turn === 0) {
    turn = 1;
    $("turnInfo").textContent = "Player 2's turn";
    $("answerForm").hidden = false;

    if (mode === "chain") {
      $("prompt").textContent =
        `Connect a new concept to: ${chain.at(-1)}`;
      renderChain();
    }
  } else {
    finishRound();
  }
}

function finishRound() {
  $("answerForm").hidden = true;

  const normalized = answers.map(item =>
    item.text.toLowerCase().trim()
  );

  const sameAnswer = normalized[0] === normalized[1];

  const results = answers.map((item, index) => {
    // Simulated rarity, not real population statistics.
    const globalRarity = Math.min(
      100,
      35 + item.text.length * 3
    );

    const matchRarity = sameAnswer ? 10 : 85;

    const rarity = Math.round(
      globalRarity * 0.6 + matchRarity * 0.4
    );

    // Placeholder values until validation is implemented.
    const connection = 70;
    const creativity = 60;

    const points =
      rarity * 4 +
      connection * 4 +
      creativity * 2;

    players[item.player].score += points;

    return {
      name: players[item.player].name,
      answer: item.text,
      points
    };
  });

  $("reveal").replaceChildren();

  results.forEach(result => {
    const line = document.createElement("p");
    line.textContent =
      `${result.name}: ${result.answer} — ${result.points} pts`;
    $("reveal").appendChild(line);
  });

  chaos = Math.min(95, chaos + 25);
  renderChaos();
  renderChain();
  renderLeaderboard();

  $("turnInfo").textContent = "Round complete!";
  $("nextBtn").hidden = false;
  $("nextBtn").textContent =
    round === 2 ? "See Winner" : "Next Round";
}

function nextRound() {
  if (round === 2) {
    finishGame();
    return;
  }

  round++;
  turn = 0;
  answers = [];
  renderRound();
}

function finishGame() {
  finished = true;
  $("nextBtn").hidden = true;
  $("answerForm").hidden = true;

  const winner =
    players[0].score === players[1].score
      ? "It's a tie!"
      : players[0].score > players[1].score
        ? "Player 1 wins!"
        : "Player 2 wins!";

  $("turnInfo").textContent = "MATCH COMPLETE";
  $("reveal").textContent = `🏆 ${winner}`;
}

function renderLeaderboard() {
  $("leaderboard").replaceChildren();

  [...players]
    .sort((a, b) => b.score - a.score)
    .forEach(player => {
      const line = document.createElement("p");
      line.textContent =
        `${player.name}: ${player.score} pts`;
      $("leaderboard").appendChild(line);
    });
}

function renderChaos() {
  $("chaosFill").style.width = `${chaos}%`;
  $("chaosText").textContent = `Chaos: ${chaos}%`;
}

function renderChain() {
  $("chainHistory").replaceChildren();

  if (mode !== "chain") return;

  const title = document.createElement("h3");
  title.textContent = "Shared Chain";
  $("chainHistory").appendChild(title);

  const line = document.createElement("p");
  line.textContent = chain.join(" → ");
  $("chainHistory").appendChild(line);
}

function showMenu() {
  $("game").hidden = true;
  $("menu").hidden = false;
}
updateDisplay();
