const maxHealth = 20
class Player {
  constructor () {
    this._health = 20
    this._tooLow = 12
    this._turn = 1
    // only save what we need
    this._captives = 1
    // full heal once per level
    // this._full = false
    this._healing = false
  }

  playTurn (warrior) {
    // console.log(`** Begin turn ${this._turn}`)
    // no captives left
    if (warrior.feel().isEmpty()) {
      if (warrior.health() < this._tooLow || this._healing) {
        if (this.underAttack(warrior)) {
          warrior.walk('backward')
        } else {
          // console.log('healing!')
          warrior.rest()
          this._healing = true
          if (warrior.health() === maxHealth) {
            this._healing = false
          }
        }
      } else {
        // console.log('walking')
        warrior.walk()
      }
    } else if (warrior.feel().isCaptive()) {
      warrior.rescue()
    } else if (warrior.feel().isWall()) {
      warrior.pivot()
    } else {
      // console.log('attacking')
      warrior.attack()
    }
    // console.log('cleaning')
    this.cleanup(warrior)
  }

  // this can't contain actions
  cleanup (warrior) {
    // console.log(`_health set to ${warrior.health()}`)
    this._health = warrior.health()

    // console.log(`** End turn ${this._turn}` + '\n')
    this._turn += 1
  }

  // action checks
  underAttack (warrior) {
    // console.log(`_health: ${this._health} | current health: ${warrior.health()}`)
    return this._health > warrior.health()
  }
}
