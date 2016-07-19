class Player {
  constructor () {
    this._health = 20
    this._healTo = 15
    this._turn = 1
  }

  playTurn (warrior) {
    // console.log(`** Begin turn ${this._turn}`)
    if (warrior.feel().isEmpty()) {
      if (warrior.health() < this._healTo && !this.underAttack(warrior)) {
        // console.log('healing!')
        warrior.rest()
      } else {
        // console.log('walking')
        warrior.walk()
      }
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
