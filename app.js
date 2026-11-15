// Controlled Chaos v0.2
// This first prototype uses a simple local rule system: no AI or account required.
// new inferface

const $ = id => document.getElementById(id);

const players = [
  { name: "Player 1", score: 0, challenges: 1 },
  { name: "Player 2", score: 0, challenges: 1 }
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
let reviewIndex = 0;
let reviewing = false;

$("rushBtn").onclick = () => startGame("rush");
$("chainBtn").onclick = () => startGame("chain");
$("menuBtn").onclick = showMenu;
$("nextBtn").onclick = nextRound;

$("acceptBtn").onclick = acceptScore;
$("challengeBtn").onclick = challengeAnswer;
$("validBtn").onclick = () => resolveChallenge(true);
$("invalidBtn").onclick = () => resolveChallenge(false);

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
  reviewing = false;

  players.forEach(player => {
    player.score = 0;
    player.challenges = 1;
  });

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
  $("explanation").value = "";
  $("answerForm").hidden = false;
  $("nextBtn").hidden = true;
  $("challengePanel").hidden = true;
  $("reviewPanel").hidden = true;
  $("reveal").replaceChildren();
  $("scoreBreakdown").replaceChildren();

  renderChaos();
  renderChain();
  renderLeaderboard();
}

function submitAnswer() {
  if (reviewing || finished) return;

  const text = $("answer").value.trim();
  const explanation = $("explanation").value.trim();

  if (!text || !explanation) return;

  const previous = chain.at(-1) || null;

  const entry = {
    player: turn,
    text,
    explanation,
    previous,
    points: 0,
    reviewed: false
  };

  answers.push(entry);

  if (mode === "chain") {
    chain.push(text);
  }

  $("answer").value = "";
  $("explanation").value = "";

  if (turn === 0) {
    turn = 1;
    $("turnInfo").textContent = "Player 2's turn";

    if (mode === "rush") {
      $("reveal").textContent =
        "Answer locked! Pass the device to Player 2.";
    } else {
      $("reveal").textContent =
        `Player 1 added: ${text} — ${explanation}`;

      $("prompt").textContent =
        `Connect a new concept to: ${text}`;

      renderChain();
    }
  } else {
    finishRound();
  }
}

function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function calculateScore(entry) {
  const duplicate = answers.some(other =>
    other !== entry &&
    normalize(other.text) === normalize(entry.text)
  );

  // Simulated global rarity, not actual player statistics.
  const globalRarity = Math.min(
    100,
    35 + entry.text.length * 3
  );

  const matchRarity = duplicate ? 10 : 85;

  const rarity = Math.round(
    globalRarity * 0.6 + matchRarity * 0.4
  );

  // These are provisional estimates, not semantic AI judging.
  const connection = 70;
  const creativity = 60;

  return {
    globalRarity,
    matchRarity,
    rarity,
    connection,
    creativity,
    total: rarity * 4 + connection * 4 + creativity * 2
  };
}

function finishRound() {
  $("answerForm").hidden = true;

  answers.forEach(entry => {
    const score = calculateScore(entry);
    entry.breakdown = score;
    entry.points = score.total;
    players[entry.player].score += entry.points;
  });

  chaos = Math.min(95, chaos + 25);
  renderChaos();
  renderChain();
  renderLeaderboard();

  reviewIndex = 0;
  reviewing = true;
  showReview();
}

function showReview() {
  const entry = answers[reviewIndex];

  if (!entry) {
    completeRound();
    return;
  }

  const opponent = players[1 - entry.player];

  $("reveal").replaceChildren();
  $("scoreBreakdown").replaceChildren();

  const answerLine = document.createElement("p");
  answerLine.textContent =
    `${players[entry.player].name}: ${entry.text}`;

  const explanationLine = document.createElement("p");
  explanationLine.textContent =
    `Explanation: ${entry.explanation}`;

  $("reveal").append(answerLine, explanationLine);

  const scoreLine = document.createElement("p");
  scoreLine.textContent =
    `Provisional score: ${entry.points} / 1000`;

  const detailLine = document.createElement("p");
  detailLine.textContent =
    `Connection: ${entry.breakdown.connection}/100 | ` +
    `Hybrid rarity: ${entry.breakdown.rarity}/100 | ` +
    `Creativity: ${entry.breakdown.creativity}/100`;

  $("scoreBreakdown").append(scoreLine, detailLine);

  $("challengePanel").hidden = false;
  $("reviewPanel").hidden = true;

  $("challengeInfo").textContent =
    `${opponent.name}: ${opponent.challenges} challenge(s) left`;

  $("challengeBtn").disabled = opponent.challenges === 0;
  $("turnInfo").textContent =
    `${opponent.name}, accept or challenge this answer.`;
}

function acceptScore() {
  if (!reviewing) return;

  $("reviewPanel").hidden = true;
  reviewIndex++;
  showReview();
}

function challengeAnswer() {
  if (!reviewing) return;

  const entry = answers[reviewIndex];
  const challenger = players[1 - entry.player];

  if (challenger.challenges <= 0) return;

  challenger.challenges--;
  $("reviewPanel").hidden = false;
  $("acceptBtn").disabled = true;
  $("challengeBtn").disabled = true;

  $("challengeInfo").textContent =
    "Challenge started. Review the explanation together.";
}

function resolveChallenge(valid) {
  if (!reviewing) return;

  const entry = answers[reviewIndex];
  const defender = players[entry.player];
  const challenger = players[1 - entry.player];

  if (!valid) {
    // Successful challenge: defender loses provisional points.
    defender.score -= entry.points;
    entry.points = 0;
  } else {
    // Unsuccessful challenge: challenger loses 100 points.
    challenger.score -= 100;
  }

  entry.reviewed = true;
  $("acceptBtn").disabled = false;
  $("challengeBtn").disabled = false;

  renderLeaderboard();

  reviewIndex++;
  showReview();
}

function completeRound() {
  reviewing = false;
  $("challengePanel").hidden = true;
  $("reviewPanel").hidden = true;

  $("turnInfo").textContent = "Round complete!";
  $("nextBtn").hidden = false;
  $("nextBtn").textContent =
    round === 2 ? "See Winner" : "Next Round";

  $("reveal").textContent =
    "All answers reviewed. Scores are finalized.";
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
        `${player.name}: ${player.score} pts ` +
        `(${player.challenges} challenges left)`;

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

  const line = document.createElement("p");
  line.textContent = chain.join(" → ");

  $("chainHistory").append(title, line);
}

function showMenu() {
  reviewing = false;
  $("game").hidden = true;
  $("menu").hidden = false;
}
updateDisplay();
