const init = () => {
  currentQuestion = questions[0];
  document.getElementById("question").innerHTML = currentQuestion.question;
  document.getElementById("answer").innerHTML = "";
  document.getElementById("answer").style.display = "none";
  document.getElementById("yes").style.display = "inline-block";
  document.getElementById("no").style.display = "inline-block";
  document.getElementById("yes").onclick = () => next(true);
  document.getElementById("no").onclick = () => next(false);
};

const next = (answer) => {
  if (typeof currentQuestion === "object") {
    currentQuestion = answer ? currentQuestion.yes : currentQuestion.no;
  }
  if (typeof currentQuestion === "string") {
    document.getElementById("question").innerHTML = "";
    document.getElementById("answer").innerHTML = currentQuestion;
    document.getElementById("answer").style.display = "block";
    document.getElementById("yes").style.display = "none";
    document.getElementById("no").style.display = "none";
  } else {
    document.getElementById("question").innerHTML = currentQuestion.question;
  }
};

let questions;
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    init();
  });
