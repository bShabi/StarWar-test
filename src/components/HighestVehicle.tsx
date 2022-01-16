import * as React from 'react';
import { IVehicle } from '../App';

interface Props {
  vehicleResult: IVehicle;
}
export const HighestVehicle: React.FC<Props> = ({ vehicleResult }: Props) => {
  return (
    <div>
      <h1>Vehicle information</h1>
      <p>
        Vehicle name with the largest sum{' '}
        <span style={{ color: '#17c0eb', fontSize: 12, fontWeight: 600 }}>
          {vehicleResult.name}
        </span>
      </p>
      <p>
        Related home planets and their respective population{' '}
        {vehicleResult.homeworld?.map((planents, index) => (
          <span
            style={{ color: '#17c0eb', fontSize: 12, fontWeight: 600 }}
            key={index}>
            {planents.name} - {planents.population.toLocaleString()}
          </span>
        ))}
      </p>
      <br></br>
      <span>
        Related pilot names{' '}
        {vehicleResult?.pilotNames?.map((name, index) => (
          <span
            style={{ color: '#17c0eb', fontSize: 12, fontWeight: 600 }}
            key={index}>
            {name}
          </span>
        ))}
      </span>
    </div>
  );
};
