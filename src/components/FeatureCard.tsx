
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: 'default' | 'alert' | 'glass';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const FeatureCard = ({
  title,
  description,
  icon,
  variant = 'default',
  onClick,
  className,
  style,
}: FeatureCardProps) => {
  const variants = {
    default: 'bg-white hover:shadow-hover border border-border/40',
    alert: 'bg-alert-50 hover:bg-alert-100 border border-alert-200/30',
    glass: 'backdrop-blur-md bg-white/50 hover:bg-white/70 border border-white/20',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-1',
        variants[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="text-safety-500">{icon}</div>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
