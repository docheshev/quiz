function print() {
  const t = "Давайте сыграем?";
  const welcomeCoverTitle = document.querySelector(".welcome-cover__title");

  let line = 0;
  let count = 0;
  let out = "";

  function typeLine() {
    let interval = setTimeout(() => {
      out += t[line][count];
      welcomeCoverTitle.innerHTML = out + "|";
      count++;

      if (count >= t[line].length) {
        count = 0;
        line++;
        if (line == t.length) {
          clearTimeout(interval);
          welcomeCoverTitle.innerHTML = out;
          return true;
        }
      }
      typeLine();
    }, 100);
  }
  typeLine();
}

export default print;
