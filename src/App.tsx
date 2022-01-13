import { useState, useEffect } from 'react';
import { PartOne } from './components/TikalTestPartOne';
import { PartTwo } from './components/TikalTestPartTwo';
import axios from 'axios';
export interface IVehiclePage {
  next: string;
  results: IVehicle[];
}
export interface IVehicle {
  name?: string;
  pilots?: [];
}
interface IPlanet {
  population: string;
}
interface IPepole {
  homeworld: string;
}
export type VehiclesType = [string, IVehicle];
//setVehicleResult
function App() {
  const [vehicleResult, setVehicleResult] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      const resultVehicle: IVehicle[] = await getVehicleResult(
        'https://swapi.py4e.com/api/vehicles'
      );
      setVehicleResult(resultVehicle);
      setLoading(true);
    };
    fetchVehicle();
  }, []);

  const getVehicleResult = async (pathUrl: string) => {
    var nextUrl = pathUrl;
    var result: IVehicle[] = [];

    while (nextUrl) {
      const res = await axios.get<IVehiclePage>(nextUrl);
      const resData: IVehicle[] = await res.data.results;
      resData.forEach((elm: IVehicle) => {
        if (elm.pilots?.length) {
          result.push(elm);
        }
      });
      nextUrl = res.data.next;
    }

    return result;
  };

  // (async () => {})();

  return (
    <div className='App'>
      {!loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <PartOne vehicle={vehicleResult} />
          <PartTwo />
        </>
      )}
    </div>
  );
}

export default App;
