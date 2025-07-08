import { LoaderCircle } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
  </div>
);

export default LoadingSpinner;