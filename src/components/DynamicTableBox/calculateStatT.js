import * as jStat from 'jstat'

export class CalculateStatT {
  constructor(
    nValues,
    deltaValues,
    pValues,
    pValue,
    coefVarValues,
    aValues,
    aValue,
    maxN,
  ) {
    this.nValues = nValues
    this.deltaValues = deltaValues
    this.pValues = pValues
    this.pValue = pValue
    this.coefVarValues = coefVarValues
    this.aValues = aValues
    this.aValue = aValue
    this.results = []
    this.maxN = maxN
  }

  calculateStat() {
    this.coefVarValues.forEach((valueCoefVar) => {
      const result = []
      this.deltaValues.forEach((valueDelta) => {
        let flag = 0
        this.nValues.every((valueN) => {
          const degreesOfFreedom = this.aValues[this.aValue] * (valueN - 1)

          const talphav = jStat.studentt.inv(
            1 - this.pValues[this.pValue],
            degreesOfFreedom,
          )

          const subscript = 2 * (1 - this.pValues[this.pValue]) * (valueN - 1)

          const tSubscript = jStat.studentt.inv(
            1 - this.pValues[this.pValue],
            subscript,
          )

          const RHS =
            2 * (valueCoefVar / valueDelta) ** 2 * (talphav + tSubscript) ** 2

          if (valueN >= RHS) {
            result.push(valueN)
            flag = 1
            return false
          }
          return true
        })
        if (flag === 0) {
          result.push(`>${this.maxN}`)
        }
      })
      this.results.push(result)
    })
    return this.results
  }
}
