interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'green' | 'red';
  fullScreen?: boolean;
}

export default function Loader({ 
  size = 'md', 
  color = 'blue',
  fullScreen = false 
}: Readonly<LoaderProps>) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500'
  };

  const spinner = (
    <div className={`border-t-2 border-b-2 ${colorClasses[color]} rounded-full animate-spin ${sizeClasses[size]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
