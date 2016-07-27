// const maxHealth = 20
const directions = ['forward', 'backward', 'left', 'right']
// const util = require('util')

class Player { // eslint-disable-line no-unused-vars
  constructor () {
    this._health = 20
    this._tooLow = 12
    this._healTo = 17
    this._turn = 1
    // only save what we need
    this._captives = 2
    // full heal once per level
    // this._full = false
    this._healing = false
  }

  playTurn (warrior) {
    // console.log(`** Begin turn ${this._turn}`)
    if (this.didAttack(warrior)) {
      // do nothing, acted already
    } else if (this.didHeal(warrior)) {
      // do nothing, acted already
    } else if (warrior.feel().isCaptive() && this._captives > 0) {
      warrior.rescue()
      this._captives -= 1
    } else if (warrior.feel().isWall()) {
      warrior.pivot()
    } else {
      // basic action
      warrior.walk()
    }
    this.cleanup(warrior)
  }

  // this can't contain actions
  cleanup (warrior) {
    // console.log(`_health set to ${warrior.health()}`)
    this._health = warrior.health()

    // console.log(`** End turn ${this._turn}` + '\n')
    this._turn += 1
  }

  didAttack (warrior) {
    // look for adjacent enemies to fight, then shoot at the farthest ones
    let enemyDir = this.adjacentEnemyDirection(warrior)
    if (enemyDir) {
      warrior.attack(enemyDir)
      return true
    } else {
      enemyDir = this.furthestEnemyDirection(warrior)
      if (enemyDir) {
        warrior.shoot(enemyDir)
        return true
      } else {
        return false
      }
    }
  }

  didHeal (warrior) {
    if (warrior.health() < this._tooLow || this._healing) {
      if (this.underAttack(warrior)) {
        warrior.walk('backward')
        return true
      } else {
        warrior.rest()
        this._healing = true
        if (warrior.health() >= this._healTo) {
          this._healing = false
        }
        return true
      }
    } else {
      return false
    }
  }

  // action checks
  underAttack (warrior) {
    // console.log(`_health: ${this._health} | current health: ${warrior.health()}`)
    return this._health > warrior.health()
  }

  // returns a bool
  enemyIsInSight (warrior, direction) {
    const unit = warrior.look(direction).find(space => !space.isEmpty())
    return unit && unit.isEnemy()
  }

  // returns false or the direction to pivot
  adjacentEnemyDirection (warrior) {
    let dir = false
    directions.forEach(d => {
      if (warrior.feel(d).isEnemy() && !dir) {
        dir = d
      }
    })
    return dir
  }

  distanceToEnemy (warrior, look) {
    return look.findIndex(i => i.isEnemy())
  }

  // returns a string for correct pivot direction or false
  furthestEnemyDirection (warrior) {
    let furthestEnemyDirection = false
    let furthestEnemyDistance = 0
    directions.forEach(d => {
      let look = warrior.look(d)
      if (this.enemyIsInSight(warrior, d) && this.distanceToEnemy(warrior, look) > furthestEnemyDistance) {
        furthestEnemyDistance = this.distanceToEnemy(warrior, look)
        furthestEnemyDirection = d
      }
    })

    return furthestEnemyDirection
  }
}
