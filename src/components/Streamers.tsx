import type { FunctionComponent } from 'react'
import { profileImages } from './profileimages'

interface Streamer {
    streamer_name: string;
    total_viewers: number;
    profile_image_url: string;
}

const API_URL = import.meta.env.PUBLIC_API_URL

// Obtiene la data (esto asume que se ejecuta en un entorno que permita await a nivel de módulo)
const data: Streamer[] = await fetch(`${API_URL}/streamers/top`).then((response) =>
    response.json()
)

const Streamers: FunctionComponent = () => {
    return (
        <div className="p-8 bg-[#1C1C1E] min-h-screen">
            <h2 className="text-white text-4xl font-extrabold mb-8 border-b border-gray-700 pb-4">
                Top Streamers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {data.map((streamer) => (
                    <a
                        key={streamer.streamer_name}
                        href={`/streamers/${streamer.streamer_name}`}  // Enlace a página individual
                        className="bg-[#301E6A] rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center"
                    >
                        <img 
                            src={profileImages[streamer.streamer_name]}
                            alt={streamer.streamer_name} 
                            className="w-24 h-24 object-cover rounded-full mb-4 border-2 border-white"
                        />
                        <h3 className="text-white text-2xl font-semibold mb-2">
                            {streamer.streamer_name}
                        </h3>
                        
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Streamers;