import * as React from 'react';
import { IPlanetPage } from '../App';
interface Props {
  planetResult: IPlanetPage[];
}

export const ChartPlanet: React.FC<Props> = ({ planetResult }: Props) => {
  const [maxValue, setMaxValue] = React.useState<number>(0);
  React.useEffect(() => {
    var highest: IPlanetPage = { name: '', population: 0 };
    var maxValue: number = 0;
    if (planetResult)
      planetResult.forEach((planet) => {
        if (!highest) highest = planet;
        else if (Number(planet.population) > Number(highest.population))
          highest = planet;
      });
    maxValue = Number(highest.population);
    setMaxValue(maxValue);
  }, [planetResult]);

  return (
    <>
      <h1>Chart</h1>
      <div className='chart'>
        <ul className='bars'>
          {planetResult.map((planet: IPlanetPage, index: number) => (
            <li key={index}>
              <div
                className='bar'
                style={{
                  height: `${(Number(planet.population) / maxValue) * 100}%`,
                }}
                data-population={Number(
                  planet.population
                ).toLocaleString()}></div>
              <span style={{ display: 'block', color: 'black' }}>
                {' '}
                {planet.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
