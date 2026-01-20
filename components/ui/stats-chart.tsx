'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface StatsChartProps {
  stats: {
    total: number;
    zeus: number;
    poseidon: number;
    apolo: number;
  };
  type?: 'pie' | 'bar';
}

const COLORS = {
  zeus: '#FFD700',
  poseidon: '#00D4FF',
  apolo: '#9B59B6',
};

export function StatsChart({ stats, type = 'pie' }: StatsChartProps) {
  const safeStats = stats ?? { total: 0, zeus: 0, poseidon: 0, apolo: 0 };
  
  const data = [
    { name: 'Zeus', value: safeStats?.zeus ?? 0, color: COLORS.zeus },
    { name: 'Poseidón', value: safeStats?.poseidon ?? 0, color: COLORS.poseidon },
    { name: 'Apolo', value: safeStats?.apolo ?? 0, color: COLORS.apolo },
  ];

  if (type === 'bar') {
    return (
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141a3d',
                border: '1px solid #FFD700',
                borderRadius: '8px',
                fontSize: 11,
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color ?? '#FFD700'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.color ?? '#FFD700'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#141a3d',
              border: '1px solid #FFD700',
              borderRadius: '8px',
              fontSize: 11,
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <span className="text-2xl font-bold text-gold">{safeStats?.total ?? 0}</span>
        <span className="text-gray-400 ml-2">aciertos totales</span>
      </div>
    </div>
  );
}
