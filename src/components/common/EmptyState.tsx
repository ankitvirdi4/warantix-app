import type { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
}

const EmptyState = ({ message, icon }: EmptyStateProps) => {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-500">
      <div className="flex flex-col items-center gap-2">
        {icon}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default EmptyState;
