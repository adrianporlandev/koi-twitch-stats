import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Stream {
  started_at: string;
  viewers_count: number;
}

interface StreamerChartProps {
  streamerName: string;
}

const API_URL = import.meta.env.PUBLIC_API_URL

const StreamerChart: React.FC<StreamerChartProps> = ({ streamerName }) => {
    console.log("Streamer Name:", streamerName);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch(`${API_URL}/streamers/${streamerName}`);
        const data = await response.json();

        // Agrupar los streams por `started_at` y calcular el promedio de viewers
        const groupedStreams: { [key: string]: number[] } = {};
        data.forEach((stream: Stream) => {
          if (!groupedStreams[stream.started_at]) {
            groupedStreams[stream.started_at] = [];
          }
          groupedStreams[stream.started_at].push(stream.viewers_count);
        });

        // Calcular el promedio de viewers para cada stream
        const processedStreams = Object.entries(groupedStreams).map(
          ([started_at, viewers]) => ({
            started_at,
            viewers_count:
              viewers.reduce((sum, count) => sum + count, 0) / viewers.length,
          })
        );

        setStreams(processedStreams);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching streams:", error);
        setLoading(false);
      }
    };

    fetchStreams();
  }, [streamerName]);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  if (streams.length === 0) {
    return <p className="text-white">No data available for this streamer.</p>;
  }

  // Ordenar los streams por fecha
  const sortedStreams = streams.sort(
    (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  );

  // Preparar los datos para la gráfica
  const data = {
    labels: sortedStreams.map((stream) =>
      new Date(stream.started_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: `Average Viewers for ${streamerName}`,
        data: sortedStreams.map((stream) => stream.viewers_count),
        borderColor: "#4F46E5", // Color de la línea
        backgroundColor: "rgba(79, 70, 229, 0.2)", // Color de fondo
        tension: 0.4, // Suavizar la línea
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Viewers Trend for ${streamerName}`,
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default StreamerChart;