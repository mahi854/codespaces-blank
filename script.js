const tracks = {
  ai: {
    title: "AI Tools for Work",
    icon: "✧",
    questions: [
      {
        prompt: "What is a helpful first step when asking an AI assistant for a draft?",
        options: ["Give it a clear goal and useful context", "Ask it to guess what you need", "Share your account password", "Use only one-word instructions"],
        answer: 0,
        explanation: "A clear goal and relevant context help an AI assistant create a more useful first draft."
      },
      {
        prompt: "An AI tool gives you a fact you plan to use in a report. What should you do?",
        options: ["Assume it is correct because it sounds confident", "Check it against a reliable source", "Copy it without reading", "Ask the AI to keep it secret"],
        answer: 1,
        explanation: "AI tools can make mistakes, so check important facts with trustworthy sources."
      },
      {
        prompt: "Which task is a sensible way to use an AI assistant at work?",
        options: ["Make the final decision about hiring someone", "Create ideas for a meeting agenda", "Store your private login details", "Send a message without reviewing it"],
        answer: 1,
        explanation: "AI can help brainstorm or draft, while people review the output and make decisions."
      },
      {
        prompt: "Before sharing information with an AI tool, what is a good habit?",
        options: ["Include private customer details for accuracy", "Check the tool's privacy rules and remove sensitive details", "Share every file you have", "Use a colleague's account"],
        answer: 1,
        explanation: "Avoid entering personal or confidential information unless you know it is appropriate and protected."
      },
      {
        prompt: "You receive an AI-written email draft. What should happen before you send it?",
        options: ["Review it for accuracy, tone, and private details", "Send it without looking", "Add made-up information to sound confident", "Delete the original request"],
        answer: 0,
        explanation: "Reviewing AI-generated text helps make sure it is accurate, suitable, and safe to share."
      }
    ]
  },
  spreadsheets: {
    title: "Spreadsheet Basics",
    icon: "▦",
    questions: [
      {
        prompt: "In a spreadsheet, what is a cell?",
        options: ["A single box where a row and column meet", "The name of a whole worksheet", "A printed page", "A type of chart"],
        answer: 0,
        explanation: "A cell is one box in a spreadsheet, identified by its column letter and row number."
      },
      {
        prompt: "Which formula adds the values from A1 through A5 in many spreadsheet apps?",
        options: ["=SUM(A1:A5)", "=ADD(A1-A5)", "SUM A1 TO A5", "=TOTAL(A1,A5)"],
        answer: 0,
        explanation: "The SUM function adds values in a range; the colon means from the first cell through the last."
      },
      {
        prompt: "What is a useful first row for a list of expenses?",
        options: ["Column headings such as Date, Item, and Cost", "A random collection of numbers", "A blank row with no labels", "The final total repeated in every cell"],
        answer: 0,
        explanation: "Clear column headings make it easier to understand, sort, and use your data."
      },
      {
        prompt: "What does sorting a column from A to Z usually do?",
        options: ["Arranges the selected information alphabetically", "Deletes duplicate rows automatically", "Adds every number in the sheet", "Locks the worksheet"],
        answer: 0,
        explanation: "Sorting arranges data in a chosen order, such as alphabetically or from smallest to largest."
      },
      {
        prompt: "Why is it useful to save a copy before making big changes to a spreadsheet?",
        options: ["It gives you a backup if you need to undo or recover", "It makes all formulas correct automatically", "It shares the file with everyone", "It prevents anyone from reading the file"],
        answer: 0,
        explanation: "A backup gives you a way to restore your work if an edit goes wrong."
      }
    ]
  },
  safety: {
    title: "Digital Safety",
    icon: "⌑",
    questions: [
      {
        prompt: "Which password is generally the strongest choice?",
        options: ["A long, unique passphrase you do not reuse", "Your first name and birth year", "The word password", "The same short password for every account"],
        answer: 0,
        explanation: "Long, unique passwords or passphrases are harder to guess, and reuse can put multiple accounts at risk."
      },
      {
        prompt: "You receive an unexpected message asking you to sign in through a link. What is safest?",
        options: ["Click quickly before it expires", "Open the service's official app or type its address yourself", "Reply with your password", "Forward it to all your contacts"],
        answer: 1,
        explanation: "Unexpected links can be deceptive. Go to the service directly instead of using the message link."
      },
      {
        prompt: "What does two-step verification add to an account?",
        options: ["A second check beyond your password", "A second public profile", "A way to share your password", "Automatic access for strangers"],
        answer: 0,
        explanation: "Two-step verification asks for another proof of identity, which can help protect your account."
      },
      {
        prompt: "When using public Wi-Fi, which habit can help keep your accounts safer?",
        options: ["Avoid sensitive tasks on networks you do not trust", "Turn off your device's screen lock", "Share files with every nearby device", "Use the same password everywhere"],
        answer: 0,
        explanation: "Be careful with sensitive accounts on public networks and use trusted, secure connections when possible."
      },
      {
        prompt: "A website asks for personal information that does not seem needed. What should you do?",
        options: ["Pause and check whether the website and request are trustworthy", "Enter extra details just in case", "Use someone else's personal information", "Post the request publicly with your details"],
        answer: 0,
        explanation: "Only share personal information when there is a good reason and you trust how it will be used."
      }
    ]
  }
};

const STORAGE_KEY = "skillsathi-progress-v1";
const elements = {
  menuToggle: document.querySelector(".menu-toggle"),
  navLinks: document.querySelector(".nav-links"),
  quizEmpty: document.querySelector("#quiz-empty"),
  quizContent: document.querySelector("#quiz-content"),
  quizTrackLabel: document.querySelector("#quiz-track-label"),
  quizTitle: document.querySelector("#quiz-title"),
  questionCount: document.querySelector("#question-count"),
  questionProgressLabel: document.querySelector("#question-progress-label"),
  progressFill: document.querySelector("#quiz-progress-fill"),
  progressBar: document.querySelector("#quiz-progress-bar"),
  questionArea: document.querySelector("#question-area"),
  feedback: document.querySelector("#quiz-feedback"),
  controls: document.querySelector("#quiz-controls"),
  submit: document.querySelector("#submit-answer"),
  result: document.querySelector("#quiz-result"),
  closeQuiz: document.querySelector("#close-quiz"),
  completedCount: document.querySelector("#completed-count"),
  progressGrid: document.querySelector("#progress-grid"),
  storageNotice: document.querySelector("#storage-notice")
};

let progress = {};
let activeQuiz = null;
let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

function showStorageNotice(message) {
  elements.storageNotice.textContent = message;
  elements.storageNotice.hidden = false;
}

function readProgress() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Saved progress has an unexpected format.");
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([id, result]) => (
        tracks[id]
        && result
        && Number.isInteger(result.score)
        && result.score >= 0
        && result.score <= tracks[id].questions.length
      ))
    );
  } catch (error) {
    console.error("Could not load SkillSathi progress:", error);
    showStorageNotice("Saved progress could not be loaded. You can still take quizzes; results may not be saved on this device.");
    return {};
  }
}

function saveProgress() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    elements.storageNotice.hidden = true;
  } catch (error) {
    console.error("Could not save SkillSathi progress:", error);
    showStorageNotice("Your quiz result is shown, but this browser could not save it. Check your browser storage settings.");
  }
}

function renderProgress() {
  const completed = Object.keys(progress).filter((id) => tracks[id]);
  elements.completedCount.textContent = `${completed.length} of ${Object.keys(tracks).length}`;
  elements.progressGrid.replaceChildren();

  Object.entries(tracks).forEach(([id, track]) => {
    const result = progress[id];
    const card = document.createElement("article");
    card.className = `progress-card${result ? " is-complete" : ""}`;

    const icon = document.createElement("span");
    icon.className = "progress-card-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = result ? "✓" : track.icon;

    const copy = document.createElement("div");
    copy.className = "progress-card-copy";
    const title = document.createElement("strong");
    title.textContent = track.title;
    const status = document.createElement("span");
    status.textContent = result ? "Quiz completed" : "Not started yet";
    copy.append(title, status);
    card.append(icon, copy);

    if (result) {
      const scorePill = document.createElement("span");
      scorePill.className = "score-pill";
      scorePill.textContent = `${Math.round((result.score / track.questions.length) * 100)}%`;
      scorePill.setAttribute("aria-label", `Latest score: ${scorePill.textContent}`);
      card.append(scorePill);
    }
    elements.progressGrid.append(card);
  });
}

function startQuiz(trackId) {
  const track = tracks[trackId];
  if (!track) return;

  activeQuiz = trackId;
  currentQuestion = 0;
  score = 0;
  hasAnswered = false;
  elements.quizEmpty.hidden = true;
  elements.quizContent.hidden = false;
  elements.quizTrackLabel.textContent = "Quick knowledge check";
  elements.quizTitle.textContent = track.title;
  elements.result.hidden = true;
  elements.controls.hidden = false;
  elements.submit.textContent = "Check answer →";
  elements.submit.disabled = true;
  renderQuestion();
  document.querySelector("#quizzes").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderQuestion() {
  const track = tracks[activeQuiz];
  const question = track.questions[currentQuestion];
  hasAnswered = false;
  elements.feedback.hidden = true;
  elements.feedback.className = "quiz-feedback";
  elements.questionCount.textContent = `QUESTION ${currentQuestion + 1} OF ${track.questions.length}`;
  elements.questionProgressLabel.textContent = `${Math.round((currentQuestion / track.questions.length) * 100)}%`;
  elements.progressFill.style.width = `${(currentQuestion / track.questions.length) * 100}%`;
  elements.progressBar.setAttribute("aria-valuenow", String(currentQuestion));
  elements.progressBar.setAttribute("aria-valuemin", "0");
  elements.progressBar.setAttribute("aria-valuemax", String(track.questions.length));

  const fieldset = document.createElement("fieldset");
  fieldset.className = "answer-list";
  fieldset.setAttribute("aria-label", "Answer choices");
  const legend = document.createElement("legend");
  legend.className = "question-prompt";
  legend.textContent = question.prompt;
  fieldset.append(legend);

  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `answer-${activeQuiz}`;
    input.value = String(index);
    input.addEventListener("change", () => {
      elements.submit.disabled = false;
    });
    const text = document.createElement("span");
    text.textContent = option;
    label.append(input, text);
    fieldset.append(label);
  });
  elements.questionArea.replaceChildren(fieldset);
  elements.controls.hidden = false;
  elements.submit.disabled = true;
  elements.submit.textContent = "Check answer →";
  elements.result.hidden = true;
}

function submitAnswer() {
  if (!activeQuiz || hasAnswered) return;
  const track = tracks[activeQuiz];
  const question = track.questions[currentQuestion];
  const selected = elements.questionArea.querySelector('input[type="radio"]:checked');
  if (!selected) return;

  hasAnswered = true;
  const isCorrect = Number(selected.value) === question.answer;
  if (isCorrect) score += 1;
  elements.questionArea.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.disabled = true;
  });
  elements.questionArea.querySelector(".answer-list").setAttribute("aria-disabled", "true");
  elements.feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
  const heading = document.createElement("strong");
  heading.textContent = isCorrect ? "That’s right!" : "Not quite — here’s why.";
  const explanation = document.createElement("span");
  explanation.textContent = isCorrect
    ? question.explanation
    : `Correct answer: ${question.options[question.answer]}. ${question.explanation}`;
  elements.feedback.replaceChildren(heading, explanation);
  elements.feedback.hidden = false;
  elements.submit.disabled = false;
  elements.submit.textContent = currentQuestion === track.questions.length - 1 ? "See my score →" : "Next question →";
}

function showResult() {
  const track = tracks[activeQuiz];
  const percentage = Math.round((score / track.questions.length) * 100);
  progress[activeQuiz] = { score, completedAt: new Date().toISOString() };
  saveProgress();
  renderProgress();

  elements.questionArea.replaceChildren();
  elements.feedback.hidden = true;
  elements.controls.hidden = true;
  elements.progressFill.style.width = "100%";
  elements.questionProgressLabel.textContent = "Complete";
  elements.progressBar.setAttribute("aria-valuenow", String(track.questions.length));
  elements.questionCount.textContent = "QUIZ COMPLETE";
  const scoreCircle = document.createElement("div");
  scoreCircle.className = "result-score";
  scoreCircle.textContent = `${percentage}%`;
  scoreCircle.setAttribute("aria-label", `Score: ${percentage} percent`);
  const heading = document.createElement("h4");
  heading.textContent = percentage >= 80 ? "Brilliant work!" : percentage >= 60 ? "Nice progress!" : "Good start!";
  const message = document.createElement("p");
  message.textContent = `You got ${score} out of ${track.questions.length} correct. Your latest score is saved in your progress.`;
  const retry = document.createElement("button");
  retry.className = "button button-primary";
  retry.type = "button";
  retry.textContent = "Try again ↻";
  retry.addEventListener("click", () => startQuiz(activeQuiz));
  elements.result.replaceChildren(scoreCircle, heading, message, retry);
  elements.result.hidden = false;
}

function setNavigationOpen(isOpen) {
  elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
  elements.menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  elements.navLinks.classList.toggle("is-open", isOpen);
}

elements.menuToggle.addEventListener("click", () => {
  const isOpen = elements.menuToggle.getAttribute("aria-expanded") === "true";
  setNavigationOpen(!isOpen);
});

elements.navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setNavigationOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.menuToggle.getAttribute("aria-expanded") === "true") {
    setNavigationOpen(false);
    elements.menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  const clickedOutsideNavigation = !elements.navLinks.contains(event.target)
    && !elements.menuToggle.contains(event.target);
  if (clickedOutsideNavigation && elements.menuToggle.getAttribute("aria-expanded") === "true") {
    setNavigationOpen(false);
  }
});

document.querySelectorAll("[data-start-quiz]").forEach((button) => {
  button.addEventListener("click", () => startQuiz(button.dataset.startQuiz));
});

elements.submit.addEventListener("click", () => {
  if (hasAnswered) {
    if (currentQuestion === tracks[activeQuiz].questions.length - 1) {
      showResult();
    } else {
      currentQuestion += 1;
      renderQuestion();
    }
    return;
  }
  submitAnswer();
});

elements.closeQuiz.addEventListener("click", () => {
  activeQuiz = null;
  elements.quizContent.hidden = true;
  elements.quizEmpty.hidden = false;
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
progress = readProgress();
renderProgress();
