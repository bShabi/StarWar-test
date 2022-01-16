import * as React from 'react';
import { IVehicle } from '../App';

interface Props {
  vehicleResult: IVehicle;
}
export const PartOne: React.FC<Props> = ({ vehicleResult }: Props) => {
  console.log('planetResult', vehicleResult);
  return (
    <div>
      <h1>Part One</h1>
      <p>
        Vehicle name with the largest sum{' '}
        <span style={{ color: 'gray' }}>{vehicleResult.name}</span>
      </p>
      <p>Related home planets and their respective population</p>
      Population -
      {vehicleResult.homeworld?.map((planents, index) => (
        <span style={{ color: 'gray' }} key={index}>
          {planents.name} - {planents.population}
        </span>
      ))}
      <br></br>
      <span>
        Related pilot names{' '}
        {vehicleResult?.pilotNames?.map((name, index) => (
          <span style={{ color: 'gray' }} key={index}>
            {name}
          </span>
        ))}
      </span>
    </div>
  );
};
