import { type ComponentType } from 'react';

type IconProps = { className?: string };

export default function Pill({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: ComponentType<IconProps>;
}) {
  return (
    <div className="pill">
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </div>
  );
}
