class AudioManager {
  constructor() {
    this.hurt = createAudio("wav/Hit_Hurt25.wav");
    this.eat = createAudio("wav/Powerup6.wav");
  }

  playHurt() {
    this.hurt.play();
  }

  playEat() {
    this.eat.play();
  }
}
