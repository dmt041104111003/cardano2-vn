import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

import { Pagination } from '~/components/ui/pagination';
import { Post, PostStatsProps, REACTION_TYPES } from '~/constants/posts';

export function PostStats({ posts, year: yearProp }: PostStatsProps) {
  const [filteredMonth, setFilteredMonth] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i).reverse();
  const [year, setYear] = useState<number>(yearProp ?? currentYear);

  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const postsByMonth: Record<number, Post[]> = {};
  months.forEach(m => { postsByMonth[m] = []; });
  if (Array.isArray(posts)) {
    posts.forEach(p => {
      const d = new Date(p.createdAt);
      if (d.getFullYear() === year) postsByMonth[d.getMonth()].push(p);
    });
  }

  let chartData = months.map(m => {
    const monthPosts = postsByMonth[m];
    let LIKE = 0, HEART = 0, HAHA = 0, SAD = 0, ANGRY = 0, WOW = 0, Comments = 0;

    const userSet = new Set<string>();
    monthPosts.forEach(p => {
      LIKE += p.LIKE || 0;
      HEART += p.HEART || 0;
      HAHA += p.HAHA || 0;
      SAD += p.SAD || 0;
      ANGRY += p.ANGRY || 0;
      WOW += p.WOW || 0;
      Comments += p.comments || 0;
      // Đếm user từ comments_rel
      if (Array.isArray(p.comments_rel)) {
        p.comments_rel.forEach((c) => {
          if (c && c.userId) userSet.add(c.userId);
        });
      }
      // Đếm user từ reactions
      if (Array.isArray(p.reactions)) {
        p.reactions.forEach((r) => {
          if (r && r.userId) userSet.add(r.userId);
        });
      }
    });
    return {
      name: `${monthNames[m]} ${year}`,
      month: m,
      LIKE, HEART, HAHA, SAD, ANGRY, WOW, Comments,
      USER: userSet.size,
    };
  });
  if (filteredMonth !== null) {
    chartData = [chartData[filteredMonth]];
  }

  const colors: Record<typeof REACTION_TYPES[number] | 'Comments' | 'USER', string> = {
    LIKE: '#2563eb',      // xanh dương đậm
    HEART: '#ef233c',     // đỏ tươi
    HAHA: '#ffd600',      // vàng tươi
    SAD: '#38bdf8',       // xanh lam nhạt
    ANGRY: '#ff6f00',     // cam đậm
    WOW: '#a020f0',       // tím
    Comments: '#6b7280',  // xám đậm
    USER: '#22c55e',      // xanh lá cây
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Year:</span>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
            title="Select year"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Post Engagement (Reactions, Comments, Shares)
          {year ? ` - ${year}` : ''}
        </h3>
        <div className="overflow-x-auto mb-4">
          <div className="flex w-max">
            <button
              className={`px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-150 border-b-2 ${filteredMonth === null ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'} rounded-l-md`}
              onClick={() => { setFilteredMonth(null); setSelectedMonth(null); }}
              style={{ minWidth: 60 }}
            >
              All
            </button>
            {months.map((m, idx) => (
              <button
                key={m}
                className={`px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-150 border-b-2 ${filteredMonth === m ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'} ${idx === months.length - 1 ? 'rounded-r-md' : ''}`}
                onClick={() => { setFilteredMonth(m); setSelectedMonth(m); }}
                style={{ minWidth: 60 }}
              >
                {monthNames[m]}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-auto md:overflow-x-hidden overflow-y-auto md:overflow-y-hidden">
          <div className="min-w-[600px] md:min-w-0">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                {REACTION_TYPES.map((type) => (
                  <Bar
                    key={type}
                    dataKey={type}
                    stackId="reactions"
                    fill={colors[type]}
                  />
                ))}
                <Bar dataKey="Comments" fill={colors.Comments} />
                <Bar dataKey="USER" fill={colors.USER} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {filteredMonth !== null && selectedMonth !== null && (
        <div className="bg-white rounded-lg shadow p-4">
          <PostMonthDetailTable posts={postsByMonth[selectedMonth ?? 0]} monthName={monthNames[selectedMonth ?? 0]} year={year ?? 0} />
        </div>
      )}
    </div>
  );
}

function PostMonthDetailTable({ posts, monthName, year }: { posts: Post[], monthName: string, year: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(posts.length / pageSize);
  const paginatedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-md font-semibold">Posts in {monthName} {year}</h4>
        <button className="text-blue-500 text-sm" onClick={() => setCurrentPage(1)}>Back - Page 1</button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-[700px] md:min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LIKE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HEART</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HAHA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ANGRY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WOW</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER_BLOG</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPosts.map((p, idx) => {
              const userSet = new Set<string>();
              if (Array.isArray(p.comments_rel)) {
                p.comments_rel.forEach((c) => { if (c && c.userId) userSet.add(c.userId); });
              }
              if (Array.isArray(p.reactions)) {
                p.reactions.forEach((r) => { if (r && r.userId) userSet.add(r.userId); });
              }
              return (
                <tr key={p.id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.LIKE || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.HEART || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.HAHA || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.SAD || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.ANGRY || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.WOW || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.comments || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">{userSet.size}</td>
                </tr>
              );
            })}
            {paginatedPosts.length === 0 && (
              <tr><td colSpan={9} className="text-center text-gray-400 py-4">No posts in this month.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={posts.length}
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
      />
    </>
  );
} 