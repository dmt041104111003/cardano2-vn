export default function Skill({
  title,
  skills,
}: {
  title: string;
  skills: { Icon: React.ComponentType; color: string; title: string; description: string }[];
}) {
  const Component = function ({
    Icon,
    color,
    title,
    description,
  }: {
    Icon: React.ComponentType<{ className?: string; color?: string }>;
    color: string;
    title: string;
    description: string;
  }) {
    return (
      <div className="rounded-sm text-card-foreground group relative overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-gray-300 dark:hover:border-white/40 hover:shadow-2xl">
        <div className="mb-4">
          <Icon color={color} />
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-300">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    );
  };

  return (
    <section className="mb-16 space-y-12">
      <h2 className="mb-8 text-left text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {skills.map((skill, index) => (
          <Component key={index} Icon={skill.Icon} color={skill.color} title={skill.title} description={skill.description} />
        ))}
      </div>
    </section>
  );
}
