interface MessageBoxProps {
    message: string;
    type: 'success' | 'error';
  }
  
  const MessageBox = ({ message, type }: MessageBoxProps) => {
    const baseClasses = 'p-4 rounded-md text-center';
    const typeClasses = type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100';
    return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
  };
  
  export default MessageBox;