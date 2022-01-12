import { useEffect, useState } from 'react';
import { PartOne } from './components/TikalTestPartOne';
import { PartTwo } from './components/TikalTestPartTwo';
interface IVehicle {
  next: string;
  results: [
    {
      name?: string;
      pialot?: string[];
    }
  ];
}
interface IPepole {
  homeworld: string;
}
interface IPlanet {
  population: string;
}

const App = (): JSX.Element => {
  (async () => {
    let nextPage = 'https://swapi.py4e.com/api/vehicles';

    let vehicles: any = [];

    while (nextPage) {
      const res = await fetch(nextPage);
      const { next, results } = await res.json();
      nextPage = next;
      vehicles = [...vehicles, results];
    }
  })();

  return (
    <div className='App'>
      <PartOne />
      <PartTwo />
    </div>
  );
};

export default App;
