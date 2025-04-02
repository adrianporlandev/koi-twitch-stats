// Asegúrate de que esta URL coincida exactamente con la URL de tu API
const API_URL = import.meta.env.PUBLIC_API_URL 

// Función mejorada para depurar problemas de conexión
interface FetchAPIOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function fetchAPI(endpoint: string, options: FetchAPIOptions = {}): Promise<any> {
    const url = `${API_URL}${endpoint}`;

    console.log(`Intentando conectar a: ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            // Añadir modo CORS explícito
            mode: "cors",
            headers: {
                ...options.headers,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`Error en respuesta API (${response.status}): ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Detalles del error: ${errorText}`);
            throw new Error(`Error API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Respuesta exitosa de ${url}:`, data);
        return data;
    } catch (error) {
        console.error(`Error al conectar con ${url}:`, error);

        // Ya no devolvemos datos de fallback automáticamente
        // para que los componentes puedan manejar los errores explícitamente
        throw error;
    }
}

export const StreamersAPI = {
  getAll: () => fetchAPI("/streamers"),
  getTop: (limit = 10) => fetchAPI(`/streamers/top?limit=${limit}`),
  getByName: (name: string) => fetchAPI(`/streamers/${name}`),
  getGrowth: (name: string, days = 7) => fetchAPI(`/streamers/${name}/growth?days=${days}`),
  getAllGrowth: (days = 7) => fetchAPI(`/streamers/growth/all?days=${days}`),
  getAdvancedStats: (name: string, timeRange = "7d") => fetchAPI(`/streamers/${name}/advanced-stats?time_range=${timeRange}`),
}

export const GamesAPI = {
  getAll: () => fetchAPI("/games"),
  getTop: (limit = 10) => fetchAPI(`/games/top?limit=${limit}`),
  getByName: (name: string) => fetchAPI(`/games/${name}`),
}

export const StatsAPI = {
  getAll: (limit = 100) => fetchAPI(`/stats?limit=${limit}`),
  getByDateRange: (startDate: string, endDate: string) => fetchAPI(`/stats/date-range?start_date=${startDate}&end_date=${endDate}`),
  getLatest: () => fetchAPI("/stats/latest"),
}