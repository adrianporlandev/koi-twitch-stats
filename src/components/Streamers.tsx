import type {FunctionComponent} from 'react'
const API_URL = import.meta.env.PUBLIC_API_URL 


const data = await fetch(`${API_URL}/streamers/top`).then((response) =>
    response.json()
)
const Streamers: FunctionComponent = () => {
    // Envía el resultado a la página.
  return <div className='text-white'>{JSON.stringify(data)}</div>;
};


export default Streamers;
