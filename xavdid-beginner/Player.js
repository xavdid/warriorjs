class Player {
  playTurn (warrior) {
    if (warrior.feel().isEmpty()) {
      warrior.walk()
    } else {
      warrior.attack()
    }
  }
}
