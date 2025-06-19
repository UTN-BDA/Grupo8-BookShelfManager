interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'sky' | 'neutral';
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  text = 'Cargando...'
}: Readonly<LoaderProps>) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const colorClasses = {
    primary: 'border-primary',
    accent: 'border-accent',
    sky: 'border-sky',
    neutral: 'border-neutral-600'
  };

  const spinner = (
    <div className="flex flex-col items-center space-y-3">
      <div className={`border-t-2 border-b-2 ${colorClasses[color]} rounded-full animate-spin ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-text-light font-medium text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-secondary bg-opacity-90 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl p-8 shadow-medium">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}
