import React, { useEffect, useState } from 'react';

interface Session {
  id: any;
  streamer_name: string;
  viewers_count: number;
  title: string;
  game: string;
  started_at: string; // e.g., "2025-03-30T14:32:19+00:00"
  snapshot_at: string | null; // o null
  profile_image_url: string | null;
}

interface Stats {
  averageViewers: number;
  peakViewers: number;
  activeDays: number;
  totalHoursStreamed: number;
}

interface StreamerStatsProps {
  streamerName: string;
}
const API_URL = import.meta.env.PUBLIC_API_URL

const StreamerStats: React.FC<StreamerStatsProps> = ({ streamerName }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/${streamerName}`);
        const sessions: Session[] = await response.json();

        if (sessions.length === 0) {
          setStats({
            averageViewers: 0,
            peakViewers: 0,
            activeDays: 0,
            totalHoursStreamed: 0,
          });
          setLoading(false);
          return;
        }
        
        let totalViewers = 0;
        let peakViewers = 0;
        let daysSet = new Set<string>();
        let totalHours = 0;
        
        sessions.forEach(session => {
          totalViewers += session.viewers_count;
          if (session.viewers_count > peakViewers) peakViewers = session.viewers_count;
          
          // Extraer la fecha (parte de YYYY-MM-DD)
          const date = new Date(session.started_at).toISOString().split('T')[0];
          daysSet.add(date);
          
          // Calcular duración en horas de cada sesión
          if (session.snapshot_at) {
            const start = new Date(session.started_at);
            const end = new Date(session.snapshot_at);
            const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            totalHours += diffHours;
          } else {
            totalHours += 2; // Duración por defecto si snapshot_at es null (ajusta según necesites)
          }
        });
        
        const averageViewers = totalViewers / sessions.length;
        setStats({
          averageViewers,
          peakViewers,
          activeDays: daysSet.size,
          totalHoursStreamed: totalHours,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, [streamerName]);

  if (loading) {
    return <p className="text-white">Cargando estadísticas...</p>;
  }

  if (!stats) {
    return <p className="text-white">No se pudieron obtener las estadísticas.</p>;
  }

  return (
    <div className="bg-[#1C1C1E] p-8 rounded-lg shadow-md text-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Estadísticas de {streamerName}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-300">Horas stremeadas:</p>
          <p className="text-white font-semibold">{stats.totalHoursStreamed.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-300">Media de viewers:</p>
          <p className="text-white font-semibold">{stats.averageViewers.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-gray-300">Peak viewers:</p>
          <p className="text-white font-semibold">{stats.peakViewers}</p>
        </div>
        <div>
          <p className="text-gray-300">Días activos:</p>
          <p className="text-white font-semibold">{stats.activeDays}</p>
        </div>
      </div>
    </div>
  );
};

export default StreamerStats;