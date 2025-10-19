import React from 'react';

export default function Card({
  children,
  className = '',
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`card ${className}`}>{children}</div>;
}
