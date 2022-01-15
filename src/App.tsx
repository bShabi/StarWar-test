import { useState, useEffect, FunctionComponent } from 'react';
import { PartOne } from './components/TikalTestPartOne';
import { PartTwo } from './components/TikalTestPartTwo';
import axios from 'axios';
export interface IVehiclePage {
  next: string;
  results: IVehicle[];
}
export interface IVehicle {
  name?: string;
  pilots?: string[];
  pilotNames?: string[];
  population: number;
  homeworld?: IPlanetPage[];
}
interface IPlanetPage {
  name: string;
  population: any;
}
interface IPepolePage {
  name: string;
  homeworld: string;
}
export type VehiclesType = [IVehicle];
//setVehicleResult
const App: FunctionComponent<{ initial?: IVehicle }> = () => {
  const [vehicleResult, setVehicleResult] = useState<IVehicle | undefined>(
    undefined
  );
  const [bestVehicle, setBestVehicle] = useState<IVehicle>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleResult) return;
    async function fetchVehicle() {
      console.log('in');
      if (vehicleResult) return;
      const resultVehicle: IVehicle[] = await getVehicleResult(
        'https://swapi.py4e.com/api/vehicles'
      );
      const vehiclePopulation: IVehicle[] = await prepeerData(resultVehicle);
      const highestVehicle: IVehicle = await getHightByPopultion(
        vehiclePopulation
      );
      console.log('highestVehicle', highestVehicle);
      setBestVehicle(highestVehicle);
      setVehicleResult(highestVehicle);
      // setLoading(true);
    }
    fetchVehicle();
  }, []);

  (async () => {})();

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
    vehicleResult.map(async (vehicle: IVehicle): Promise<any> => {
      vehicle.population = 0;
      vehicle.homeworld = [];
      vehicle.pilotNames = [];
      vehicle.pilots?.forEach(async (pialotUrl: string) => {
        var homeWorld: IPepolePage = await prepeerHomeWorldToVehicle(pialotUrl);
        if (!homeWorld) {
          return;
        }
        const homeWorldPage: IPlanetPage = await reducerPopulation(
          homeWorld.homeworld
        );
        console.log('homeWorldPage', homeWorldPage);
        vehicle.homeworld?.push(homeWorldPage);

        vehicle.population += homeWorldPage.population;
        vehicle.pilotNames?.push(homeWorld.name);
      });
    });

    return vehicleResult;
  };
  const prepeerHomeWorldToVehicle = async (pathUrl: string): Promise<any> => {
    const res = await axios.get<IPepolePage>(pathUrl);
    const planetPage: IPepolePage = {
      name: res.data.name,
      homeworld: res.data.homeworld,
    };
    if (!planetPage.homeworld) return null;
    return planetPage;

    // const resData: IPepolePage = await res.data.homeworld ;
    // return resData;
  };
  const reducerPopulation = async (pathUrl: string): Promise<IPlanetPage> => {
    const res = await axios.get<IPlanetPage>(pathUrl);
    const homeWorldPage: IPlanetPage = {
      name: res.data.name,
      population:
        res.data.population === 'unknown' ? 0 : Number(res.data.population),
    };
    return homeWorldPage;
  };

  const getHightByPopultion = async (vehicles: IVehicle[]): Promise<any> => {
    return vehicles.reduce(function (prev, current) {
      return prev.population > current.population ? prev : current;
    });
  };
  // (async () => {})();

  return (
    <>
      {!bestVehicle ? (
        <div>Loading...</div>
      ) : (
        <div className='App'>
          <h1 onClick={() => console.log(bestVehicle.population)}>Click</h1>
          <p>name {bestVehicle.name}</p>
          <p>Population {bestVehicle.population}</p>
          <p>
            Related home planets and their respective population{' '}
            {bestVehicle.population}
          </p>
          <p>Population {bestVehicle.population}</p>

          {/* <PartOne vehicle={vehicleResult} />
          <PartTwo /> */}
        </div>
      )}
    </>
  );
};

export default App;
