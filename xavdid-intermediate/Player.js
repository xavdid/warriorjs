// const maxHealth = 20
const directions = ['forward', 'right', 'backward', 'left']
// const util = require('util')

class Player { // eslint-disable-line no-unused-vars
  constructor () {
    this._health = 20
    this._tooLow = 12
    this._healTo = 17
    this._turn = 1
    this._captives = 1
    this._healing = false
  }

  playTurn (warrior) {
    // console.log(`** Begin turn ${this._turn}`)
    // clear captives first, so anything left must be an enemy
    if (this._captives > 0 && this.didHelpCaptive(warrior)) {
      // do nothing, acted already
    } else if (this.didAttack(warrior)) {
      // do nothing, acted already
    } else if (this.didHeal(warrior)) {
      // do nothing, acted already
      // } else if (warrior.feel().isWall()) {
      // warrior.pivot()
    } else {
      // basic action
      warrior.walk(warrior.directionOfStairs())
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
    if (enemyDir && this.numAdjacentEnemies(warrior) > 1) {
      warrior.bind(enemyDir)
      return true
    } else if (warrior.health() < 5 && this.didHeal(warrior)) {
      return true
    } else {
      if (enemyDir) {
        warrior.attack(enemyDir)
        return true
      } else {
        let captiveDir = this.adjacentCaptiveDirection(warrior)
        if (captiveDir && this._captives === 0) {
          // don't get too low- if everyone is bound, take time to heal
          if (this.didHeal(warrior)) {
            // acted, do nothing
          } else {
            warrior.attack(captiveDir)
          }
          return true
        }
      }
      // can't shoot yet
      // enemyDir = this.furthestEnemyDirection(warrior)
      // if (enemyDir) {
      //   warrior.shoot(enemyDir)
      //   return true
      // } else {
      return false
    // }
    }
  }

  // handles retreating and heading
  didHeal (warrior) {
    if (warrior.health() < this._tooLow || this._healing) {
      if (this.underAttack(warrior)) {
        let retreatDir
        if (this.opposite(this.adjacentEnemyDirection(warrior)).isEmpty()) {
          retreatDir = this.opposite(this.adjacentEnemyDirection(warrior))
        } else {
          retreatDir = this.opposite(warrior.directionOfStairs())
        }
        warrior.walk(retreatDir)
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

  didHelpCaptive (warrior) {
    let dir = false
    let acted = false
    directions.forEach(d => {
      if (warrior.feel(d).isCaptive()) {
        warrior.rescue(d)
        this._captives -= 1
        acted = true
      }
    })

    if (acted) { return true }

    directions.forEach(d => {
      if (this.captiveIsInSight(warrior, d) && !dir) {
        dir = d
      }
    })

    if (dir) {
      warrior.walk(dir)
      return true
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

  captiveIsInSight (warrior, direction) {
    const unit = warrior.look(direction).find(space => !space.isEmpty())
    return unit && unit.isCaptive()
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

  // number of adjacent enemies
  numAdjacentEnemies (warrior) {
    return directions.map(d => warrior.feel(d).isEnemy()).filter(d => d).length
  }

  adjacentCaptiveDirection (warrior) {
    let dir = false
    directions.forEach(d => {
      if (warrior.feel(d).isCaptive() && !dir) {
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

  opposite (dir) {
    return directions[(directions.indexOf(dir) + 2) % 4]
  }
}
