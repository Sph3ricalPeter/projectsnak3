/**
 * This class handles score couting and storing
 * Uses API fetch to manage data
 */
const API_URL = "...";

class Score {
  constructor() {
    this.hiscores = [{ name: "Player", count: 0 }];
    this.nickname = "Player";
    this.current = 0;
  }

  /**
   * Resets hiscores and saved hiscores to initial values
   */
  reset() {
    score.hiscores = [{ name: "Player", count: 0 }];
    score.nickname = "Player";
    score.current = 0;
    fetch(API_URL, {
      method: "DELETE",
    })
      .then(() => {
        console.log("Hiscores reset successfully");
        score.recordHiscore();
      })
      .catch((error) => console.error("Error:", error));
  }

  /**
   * Saves current player's highscore
   */
  recordHiscore() {
    if (!this.hiscores.includes({ name: this.nickname })) {
      this.hiscores.push({ name: this.nickname, count: 0 });
    } else {
      let i = this.hiscores.findIndex(
        (record) => record.name === this.nickname
      );
      this.hiscores[i].count = Math.max(this.hiscores[i].count, this.current);
    }

    let record = { name: this.nickname, count: this.current };
    console.log("Saving score: ", record);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `name=${record.name}&count=${record.count}`,
    })
      .then((response) => console.log("Score saved successfully:", response))
      .catch((error) => console.error("Error:", error));
  }

  /**
   * Loads hiscores
   */
  async loadHiscores() {
    return fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched hiscores:", data);
        this.hiscores = data;
        if (this.hiscores.length < 1) {
          this.hiscores = [{ name: "Player", count: 0 }];
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.hiscores = [{ name: "Player", score: 0 }];
      })
      .finally(() => {
        return this.hiscores;
      });
  }

  /**
   * Returns top entries from hiscores sorted by score in descending order
   * @param {number} n number of top entris to be returned
   */
  getTopN(n) {
    // sorty by 2nd element (value) & return only top 10 elements
    return this.hiscores
      .sort((f, s) => {
        return s.count - f.count;
      })
      .slice(0, n);
  }
}
