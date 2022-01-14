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
  population: number;
  homeworld?: IPlanetPage;
}
interface IPlanetPage {
  population: any;
}
interface IPepolePage {
  homeworld?: string;
}
export type VehiclesType = [IVehicle];
//setVehicleResult
function App() {
  const [vehicleResult, setVehicleResult] = useState<IVehicle[] | IVehicle>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVehicle() {
      const resultVehicle: IVehicle[] = await getVehicleResult(
        'https://swapi.py4e.com/api/vehicles'
      );
      const vehiclePopulation: IVehicle[] = await prepeerData(resultVehicle);
      const highestVehicle: IVehicle = await getHightByPopultion(
        vehiclePopulation
      );
      setVehicleResult(highestVehicle);
      setLoading(true);
    }
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
  const prepeerData = async (
    vehicleResult: IVehicle[]
  ): Promise<IVehicle[]> => {
    vehicleResult.map(async (e: IVehicle): Promise<any> => {
      e.population = 0;
      var homeworld;
      e.pilots?.forEach(async (pialotUrl: string) => {
        homeworld = await prepeerHomeWorldToVehicle(pialotUrl);
        if (homeworld) {
          e.population += await reducerPopulation(homeworld);
        }
      });
    });

    return vehicleResult;
  };
  const prepeerHomeWorldToVehicle = async (pathUrl: string): Promise<any> => {
    const res = await axios.get<IPepolePage>(pathUrl);
    const homeworld = await res.data.homeworld;
    if (!homeworld) return;
    return homeworld;

    // const resData: IPepolePage = await res.data.homeworld ;
    // return resData;
  };
  const reducerPopulation = async (pathUrl: string): Promise<number> => {
    const res = await axios.get<IPlanetPage>(pathUrl);
    const resData = await res.data.population;
    if (resData === 'unknown') {
      return 0;
    }
    return Number(resData);
  };

  const getHightByPopultion = async (vehicles: IVehicle[]) => {
    return vehicles.reduce(function (prev, current) {
      return prev.population > current.population ? prev : current;
    });
  };
  // (async () => {})();

  return (
    <>
      {!loading ? (
        <div>Loading...</div>
      ) : (
        <div className='App'>
          <PartOne vehicle={vehicleResult} />
          <PartTwo />
        </div>
      )}
    </>
  );
}

export default App;
