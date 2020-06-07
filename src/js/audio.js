/* Simple audio manager to play audioclips */
class AudioManager {
  constructor() {
    this.enabled = true;
    this.hurt = createAudio("wav/Hit_Hurt25.wav");
    this.eat = createAudio("wav/Powerup6.wav");
  }

  playHurt() {
    if (this.enabled) {
      this.hurt.play();
    }
  }

  playEat() {
    if (this.enabled) {
      this.eat.play();
    }
  }
}
