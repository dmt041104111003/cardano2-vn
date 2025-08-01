import { StatItem, AdminStatsProps } from '~/constants/admin';

export function AdminStats({ stats }: AdminStatsProps) {
  const getColorClass = (color?: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600';
      case 'blue':
        return 'text-blue-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap items-center gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-sm text-gray-500">
            {stat.label}: <span className={`font-semibold ${getColorClass(stat.color)}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 