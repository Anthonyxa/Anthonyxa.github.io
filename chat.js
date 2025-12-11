let quizMode = false;
let quizScore = 0;

async function sendMessage(forcedMessage = null) {
  const log = document.getElementById("chat-log");
  const input = document.getElementById("chat-input");

  // Support forced messages (like "start quiz")
  const message = forcedMessage ? forcedMessage.trim() : input.value.trim();
  if (!message) return;

  log.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  input.value = "";

  const pageText = document.body.innerText;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: message,
      context: pageText,
      quizMode: quizMode,
      quizScore: quizScore
    })
  });

  const data = await response.json();
  const answer = data.answer;

  if (quizMode && answer.toLowerCase().includes("correct")) {
    quizScore++;
  }

  log.innerHTML += `<div><strong>AI:</strong> ${answer}</div>`;
  log.scrollTop = log.scrollHeight;
}

function startQuiz() {
  quizMode = true;
  quizScore = 0;

  const log = document.getElementById("chat-log");
  log.innerHTML += `<div><strong>AI:</strong> Starting "How Well Do You Know Anthony?" quiz! Answer each question.</div>`;

  // Actually trigger quiz in backend
  sendMessage("start quiz");
}
