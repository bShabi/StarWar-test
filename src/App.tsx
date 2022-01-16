import { useState, useEffect, FunctionComponent } from 'react';
import { HighestVehicle } from './components/HighestVehicle';
import { ChartPlanet } from './components/Chart';
import axios from 'axios';

export interface IVehiclePage {
  next: string;
  results: IVehicle[];
}
export interface IPlanetPageResult {
  next: string;
  results: IPlanetPage[];
}

export interface IVehicle {
  name?: string;
  pilots: string[];
  pilotNames?: string[];
  population: number;
  homeworld?: IPlanetPage[];
}

export interface IPlanetPage {
  name: string;
  population: number | string;
}

export interface IPepolePage {
  name: string;
  homeworld: string;
}

export type VehiclesType = [IVehicle];
//setVehicleResult
const App: FunctionComponent<{ initial?: IVehicle }> = () => {
  const [vehicleResult, setVehicleResult] = useState<IVehicle | null>(null);
  const [bestVehicle, setBestVehicle] = useState<IVehicle | null>();
  const [planetResult, setPlanetResult] = useState<IPlanetPage[]>([]);
  const listOfPlanets: string[] = [
    'Tatooine',
    'Alderaan',
    'Naboo',
    'Bespin',
    'Endor',
  ];

  useEffect(() => {
    if (vehicleResult) return;

    async function fetchVehicle() {
      if (vehicleResult) return;
      const resultVehicle: IVehicle[] = await getVehicleResult(
        'https://swapi.py4e.com/api/vehicles'
      );
      const vehiclePopulation: null | IVehicle[] = await prepareData(
        resultVehicle
      );
      const highestVehicle: null | IVehicle =
        getByHighestPopulation(vehiclePopulation);

      setBestVehicle(highestVehicle);
      setVehicleResult(highestVehicle);
      // setLoading(true);
    }
    async function fetchPlanets() {
      const resultPlanets: IPlanetPage[] = await getPlanetsResultByList(
        'https://swapi.py4e.com/api/planets'
      );
      setPlanetResult(resultPlanets);
    }
    fetchVehicle();
    fetchPlanets();
  }, []);

  const getPlanetsResultByList = async (pathUrl: string) => {
    var nextUrl = pathUrl;
    var result: IPlanetPage[] = [];

    while (nextUrl) {
      const res = await axios.get<IPlanetPageResult>(nextUrl);
      const resData = await res.data.results;
      resData.forEach((elm: IPlanetPage) => {
        if (elm.name?.length)
          if (listOfPlanets.includes(elm.name)) {
            result.push({ name: elm.name, population: elm.population });
          }
      });
      nextUrl = res.data.next;
    }

    return result;
  };

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

  const prepareData = async (
    vehicleResult: IVehicle[]
  ): Promise<null | IVehicle[]> => {
    for (const vehicle of vehicleResult) {
      vehicle.population = 0;
      vehicle.homeworld = [];
      vehicle.pilotNames = [];
      for (const url of vehicle.pilots) {
        const homeWorld: null | IPepolePage = await prepareHomeWorldToVehicle(
          url
        );

        if (!homeWorld) return null;

        const homeWorldPage: IPlanetPage = await reducerPopulation(
          homeWorld.homeworld
        );
        vehicle.homeworld?.push(homeWorldPage);

        vehicle.population += Number(homeWorldPage.population);
        vehicle.pilotNames?.push(homeWorld.name);
      }
    }
    return vehicleResult;
  };
  const prepareHomeWorldToVehicle = async (
    pathUrl: string
  ): Promise<null | IPepolePage> => {
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
    const { population, name } = await res.data;
    return {
      name: res.data.name,
      population:
        res.data.population === 'unknown' ? 0 : Number(res.data.population),
    };
  };

  const getByHighestPopulation = (
    vehicles: IVehicle[] | null
  ): null | IVehicle => {
    let highest: null | IVehicle = null;

    if (vehicles)
      vehicles.forEach((vehicle) => {
        if (!highest) highest = vehicle;
        else if (vehicle.population > highest.population) highest = vehicle;
      });

    return highest;
  };

  return (
    <>
      {!bestVehicle ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ textAlign: 'center' }}>
            <HighestVehicle vehicleResult={bestVehicle} />
          </div>
          <div style={{ textAlign: 'center', paddingTop: 50 }}>
            <ChartPlanet planetResult={planetResult} />
          </div>
        </>
      )}
    </>
  );
};

export default App;
