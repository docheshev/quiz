function welcome() {
  const welcomeCover = document.querySelector(".welcome-cover");
  const welcomeCoverBtn = document.querySelector(".welcome-cover__btn");
  const bg = document.querySelector(".bg");
  const quiz = document.querySelector(".quiz");
  
  welcomeCoverBtn.onclick = appearance;

  function appearance() {
    bg.classList.add("active");
    quiz.classList.add("active");
    welcomeCover.classList.add("hidden");
  }
}

export default welcome;
