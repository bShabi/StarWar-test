import * as React from 'react';
import { IPlanetPage } from '../App';
interface Props {
  planetResult: IPlanetPage[];
}

export const PartTwo: React.FC<Props> = ({ planetResult }: Props) => {
  console.log(planetResult);

  const max = 4_500_000_000;

  return (
    <>
      <h1>Part Two - Chart</h1>
      <div className='chart'>
        <ul className='bars'>
          {planetResult.map((planet: IPlanetPage, index: number) => (
            <li key={index}>
              <div
                className='bar'
                style={{
                  height: `${(Number(planet.population) / max) * 100}%`,
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
