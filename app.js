// Controlled Chaos v0.1
// This first prototype uses a simple local rule system: no AI or account required.

const prompts = [
  "Find something connected to your answer, but not in the same category.",
  "Connect your answer to something that moves.",
  "Find something that shares a shape, function, or hidden similarity.",
  "Make a connection that seems unrelated at first—but can be explained.",
  "Connect your answer to something from nature.",
  "Find a link between your answer and something people invented.",
  "Make your strangest defensible connection yet."
];

const form = document.querySelector("#answer-form");
const input = document.querySelector("#answer-input");
const prompt = document.querySelector("#prompt");
const hint = document.querySelector("#hint");
const feedback = document.querySelector("#feedback");
const list = document.querySelector("#chain-list");
const roundLabel = document.querySelector("#round-label");
const chainCount = document.querySelector("#chain-count");
const chaosFill = document.querySelector("#chaos-fill");
const chaosValue = document.querySelector("#chaos-value");
const resetButton = document.querySelector("#reset-button");

let chain = [];
let chaos = 10;

function updateDisplay() {
  roundLabel.textContent = `ROUND ${String(chain.length + 1).padStart(2, "0")}`;
  chainCount.textContent = `${chain.length} CONNECTION${chain.length === 1 ? "" : "S"}`;
  chaosFill.style.width = `${chaos}%`;
  chaosValue.textContent = `${chaos}%`;

  if (!chain.length) {
    list.innerHTML = '<li class="empty-state">Your ideas will appear here.</li>';
  } else {
    list.innerHTML = "";
    chain.forEach((word) => {
      const item = document.createElement("li");
      item.textContent = word;
      list.appendChild(item);
    });
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = input.value.trim();
  if (!answer) return;

  if (chain.some((word) => word.toLowerCase() === answer.toLowerCase())) {
    feedback.textContent = "You've already used that idea. Find a new route.";
    return;
  }

  chain.push(answer);
  chaos = Math.min(95, 10 + chain.length * 12);
  const previous = chain.length > 1 ? chain[chain.length - 2] : "the starting prompt";

  if (chain.length === 1) {
    feedback.textContent = `First link placed: ${answer}. Now follow the association.`;
    prompt.textContent = prompts[0];
    hint.textContent = `Your next answer should connect to “${answer}.”`;
  } else {
    feedback.textContent = ` 연결: ${previous} → ${answer}. Keep the chain defensible.`;
    const nextPrompt = prompts[Math.min(chain.length - 1, prompts.length - 1)];
    prompt.textContent = nextPrompt;
    hint.textContent = `Your next answer should connect to “${answer}.”`;
  }

  if (chaos >= 90) {
    hint.textContent += " Chaos is near its limit—make the connection surprising, but explainable.";
  }

  input.value = "";
  updateDisplay();
  input.focus();
});

resetButton.addEventListener("click", () => {
  chain = [];
  chaos = 10;
  prompt.textContent = "Name something that grows.";
  hint.textContent = "Start anywhere. Your answer becomes the next link.";
  feedback.textContent = "Make your first connection.";
  input.value = "";
  updateDisplay();
});

updateDisplay();
