import questions from "./questions";

function quiz() {
  const data = questions;

  const quizHeader = document.querySelector("#quiz-header");
  const quizList = document.querySelector("#quiz-answers");
  const quizSubmit = document.querySelector("#quiz-submit");

  let score = 0;
  let questionIndex = 0;

  clearElements();
  renderQuestion();
  quizSubmit.onclick = checkAnswer;

  function clearElements() {
    quizHeader.innerHTML = "";
    quizList.innerHTML = "";
  }

  function renderQuestion() {
    const question = data[questionIndex]["question"];

    const quizQuestionTemplate = `<h2 class="quiz-header__question-title">%question%</h2>`;
    const quizQuestionTitle = quizQuestionTemplate.replace(
      "%question%",
      question
    );
    quizHeader.innerHTML = quizQuestionTitle;

    for (const [i, answerText] of data[questionIndex]["answers"].entries()) {
      const quizAnswerTemplate = `<li class="quiz-answers__item">
          <label class="quiz-answers__label">
            <input value="%number%" type="radio" class="quiz-answers__answer" name="quiz-answers__answer" />
            <span>%answer%</span>
          </label>
        </li>`;
      let numberAnswer = i + 1;
      const quizAnswer = quizAnswerTemplate
        .replace("%answer%", answerText)
        .replace("%number%", numberAnswer);

      quizList.innerHTML += quizAnswer;
    }
  }

  function checkAnswer() {
    const quiz = document.querySelector("#quiz");
    const quizAnswersLabel = document.querySelectorAll(".quiz-answers__label");
    const checkedAnswer = quizList.querySelector('input[type="radio"]:checked');

    if (!checkedAnswer) {
      quizSubmit.blur();
      document.querySelectorAll("label");
      for (let i = 0; i < quizAnswersLabel.length; i++) {
        const el = quizAnswersLabel[i];
        el.classList.add("not-selected");
        el.onclick = () => {
          quizAnswersLabel.forEach((el) => {
            el.classList.remove("not-selected");
          });
        };
      }
      setInterval(() => {
        quiz.classList.add("shake");
      }, 100);
      quiz.classList.remove("shake");

      return;
    }

    const userAnswer = parseInt(checkedAnswer.value);

    const correctAnswer = data[questionIndex]["correct"];

    if (userAnswer === correctAnswer) {
      score++;
    }

    if (questionIndex !== data.length - 1) {
      questionIndex++;
      clearElements();
      renderQuestion();
      return;
    } else {
      clearElements();
      showResults();
    }
  }
  function showResults() {
    const resultsTemplate = `<h2 class="quiz-header__results-title">%title%</h2>
      <h3 class="quiz-header__results-summary">%message%</h3>
      <p class="quiz-header__results-result">%result%</p>`;
    let title, message;
    const body = document.body;
    const bg = document.querySelector(".bg");
    const fireworks = document.querySelector(".fireworks");

    function setBodyBg() {
      body.style.backgroundImage = "url('./img/bg/satisfactory-bg.gif')";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "top center";
    }

    if (score === data.length) {
      title = "Поздравляем!";
      message = "Вы ответили верно на все вопросы!";
      fireworks.classList.add("active");
    } else if ((score * 100) / data.length >= 50) {
      title = "Неплохой результат";
      message = "Вы дали более половины правильных ответов";
      setBodyBg();
    } else {
      title = "Не расстраивайся, все ещё впереди!";
      message = "Пока у вас меньше половины правильных ответов";
      setBodyBg();
    }

    let result = `${score} из ${data.length}`;

    const finalMessage = resultsTemplate
      .replace("%title%", title)
      .replace("%message%", message)
      .replace("%result%", result);
    quizHeader.innerHTML = finalMessage;

    quizSubmit.blur();
    quizSubmit.innerText = "Начать заново";
    quizSubmit.onclick = () => {
      quiz();
      bg.classList.add("active");
      fireworks.classList.remove("active");
      document.body.style.background = "var(--page-bg)";
      quizSubmit.innerText = "Ответить";
    };
    bg.classList.remove("active");
  }
}

export default quiz;
