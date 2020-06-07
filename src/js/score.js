class Score {
  constructor() {
    this.hiscores = { player: 0 };
    this.nickname = "player";
    this.current = 0;
  }

  recordHiscore() {
    if (this.hiscores[this.nickname] == null) {
      this.hiscores[this.nickname] = 0;
    }

    this.hiscores[this.nickname] = Math.max(
      this.hiscores[this.nickname],
      this.current
    );

    localStorage.setItem("hiscores", JSON.stringify(this.hiscores));
  }

  loadHiscores() {
    this.hiscores = JSON.parse(localStorage.getItem("hiscores"));

    if (this.hiscores == null) {
      this.hiscores = { player: 0 };
    } else {
      console.log("loaded hiscores successfully");
    }
  }

  /**
   * Returns top 10 player + scores from the hiscores array
   */
  getTopN(n) {
    let scoresArray = Object.keys(this.hiscores).map((player) => {
      return [player, this.hiscores[player]];
    });

    // sorty by 2nd element (value) & return only top 10 elements
    return scoresArray
      .sort((f, s) => {
        return s[1] - f[1];
      })
      .slice(0, n);
  }
}
