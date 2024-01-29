import { useEffect } from 'react'
import { allYears } from '../../data/allYears'
import { AreaSelectorContainer } from '../AreaSelector/styles'
import { ToogleSwitch } from './styles'

interface YearSelectionProps {
  yearSelected: number
  setYearSelected: any
  allYearToogle?: boolean
}

export function YearSelection({
  yearSelected,
  setYearSelected,
  allYearToogle,
}: YearSelectionProps) {
  function handleChangeYear(e: any) {
    setYearSelected(parseInt(e.target.value))
  }
  function handleChangeYearAll(e: any) {
    setYearSelected((yearSelected: number) =>
      yearSelected === allYears.length - 1 ? 0 : allYears.length - 1,
    )
  }

  useEffect(() => {
    if (!allYearToogle) {
      if (yearSelected === allYears.length - 1) {
        setYearSelected(0)
      }
    }
  }, [])

  return (
    <AreaSelectorContainer>
      <div
        className={
          yearSelected > allYears.length - 2
            ? 'flex justify-center pt-1 pb-1 gap-2 cursor-not-allowed opacity-50 w-full'
            : 'flex justify-center pt-1 pb-1 gap-2  w-full'
        }
      >
        <p className="font-bold">Year:</p>
        <input
          type="range"
          className="w-30"
          disabled={yearSelected > allYears.length - 2}
          step={1}
          min={0}
          max={allYears.length - 2}
          value={yearSelected > allYears.length - 2 ? 0 : yearSelected}
          onChange={handleChangeYear}
        />
        <p className="font-bold pt-0">{allYears[yearSelected].toUpperCase()}</p>
      </div>
      {allYearToogle && (
        <div className="flex justify-center pt-1 pb-0 gap-4">
          <p className="font-bold">All years:</p>
          <ToogleSwitch>
            <input
              type="checkbox"
              onChange={handleChangeYearAll}
              checked={yearSelected > allYears.length - 2}
            />
            <span />
          </ToogleSwitch>
        </div>
      )}
    </AreaSelectorContainer>
  )
}
