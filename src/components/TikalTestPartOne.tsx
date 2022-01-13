import * as React from 'react';
export const PartOne = (props: any): JSX.Element => {
  return (
    <div>
      <button onClick={() => console.log(props.vehicle)}>Part One</button>
    </div>
  );
};
