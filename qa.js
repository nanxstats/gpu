let questions;
let currentQuestion;
let questionPath = [];

// Calculate current progress
const calculateProgress = () => {
  const depth = questionPath.length;
  const maxDepth = 8;
  return Math.min((depth / maxDepth) * 100, 90);
};

// Update progress bar
const updateProgressBar = () => {
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');

  if (questionPath.length > 0) {
    progressContainer.style.opacity = '1';
    const progress = calculateProgress();
    progressBar.style.width = `${progress}%`;
  } else {
    progressContainer.style.opacity = '0';
    progressBar.style.width = '0%';
  }
};

// Smooth transition between questions
const transitionQuestion = (callback) => {
  const questionEl = document.getElementById('question');

  questionEl.style.opacity = '0';

  setTimeout(() => {
    callback();
    requestAnimationFrame(() => {
      questionEl.style.opacity = '1';
    });
  }, 200);
};

// Initialize the app
const init = () => {
  currentQuestion = questions[0];
  questionPath = [];

  document.getElementById("question").innerHTML = currentQuestion.question;
  document.getElementById("question").style.opacity = '1';
  document.getElementById("answer").classList.add('hidden');

  document.getElementById("yes").style.display = "block";
  document.getElementById("no").style.display = "block";
  document.getElementById("yes").onclick = () => nextQuestion(true);
  document.getElementById("no").onclick = () => nextQuestion(false);

  updateProgressBar();
};

// Handle button clicks
const nextQuestion = (answer) => {
  if (typeof currentQuestion === "object") {
    questionPath.push({ question: currentQuestion, answer });
    currentQuestion = answer ? currentQuestion.yes : currentQuestion.no;
  }

  if (typeof currentQuestion === "string") {
    // Show answer
    transitionQuestion(() => {
      document.getElementById("question").innerHTML = "";
      document.getElementById("answer").classList.remove('hidden');
      document.getElementById("answer").querySelector('p').innerHTML = currentQuestion;
      document.getElementById("yes").style.display = "none";
      document.getElementById("no").style.display = "none";

      const progressBar = document.getElementById('progress-bar');
      progressBar.style.width = '100%';
    });
  } else if (currentQuestion && currentQuestion.question) {
    // Show next question
    transitionQuestion(() => {
      document.getElementById("question").innerHTML = currentQuestion.question;
      updateProgressBar();
    });
  }
};

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (document.getElementById("yes").style.display !== "none") {
    if (e.key === 'y' || e.key === 'Y' || e.key === '1') {
      nextQuestion(true);
    } else if (e.key === 'n' || e.key === 'N' || e.key === '2') {
      nextQuestion(false);
    } else if (e.key === 'r' || e.key === 'R' || e.key === '0') {
      init();
    }
  }
});

// Load questions and start
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    if (questions && questions[0]) {
      init();
    } else {
      throw new Error("Invalid question data");
    }
  })
  .catch((error) => {
    console.error("Error loading questions:", error);
    document.getElementById("question").innerHTML = "Error loading questions. Please refresh the page.";
  });