/**
 * This class handles score couting and storing
 * Uses local storage to persist data
 */
class Score {
  constructor() {
    this.hiscores = { player: 0 };
    this.nickname = "player";
    this.current = 0;
  }

  /**
   * Resets hiscores and saved hiscores to initial values
   */
  reset() {
    score.hiscores = {};
    score.nickname = "Player";
    score.current = 0;
    score.recordHiscore();
  }

  /**
   * Saves current player's highscore
   */
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

  /**
   * Loads hiscores from localStorage, if item doesn't exist, creates new empty hiscores
   */
  loadHiscores() {
    this.hiscores = JSON.parse(localStorage.getItem("hiscores"));

    if (this.hiscores == null) {
      this.hiscores = { player: 0 };
    } else {
      console.log("loaded hiscores successfully");
    }
  }

  /**
   * Returns top entries from hiscores sorted by score in descending order
   * @param {number} n number of top entris to be returned
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
