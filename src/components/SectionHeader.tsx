export default function SectionHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div>{right}</div>
    </div>
  );
}
