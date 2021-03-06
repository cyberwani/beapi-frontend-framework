import axe from 'axe-core'

class AccessibilityTests {
  constructor() {
    this.rules = ['wcag2a', 'wcag2aa']
  }

  init() {
    axe.getRules(this.rules)
    axe.run(document, (err, results) => {
      if (err) throw err
      console.log(results.violations)
    })
  }
}

export default AccessibilityTests
