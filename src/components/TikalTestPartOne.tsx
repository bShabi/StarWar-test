import * as React from 'react';
import { IVehicle } from '../App';
export const PartOne = (vehicle: IVehicle) => {
  React.useEffect(() => {
    console.log(vehicle);
  }, [vehicle]);
  return (
    <>
      <h1>{vehicle.name}</h1>
      <h1>{vehicle.population}</h1>
    </>
  );
};
