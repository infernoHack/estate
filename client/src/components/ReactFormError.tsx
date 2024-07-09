type ReactFormErrorProps = {
  message: string;
  className?: string;
};

function ReactFormError({ message, className }: ReactFormErrorProps) {
  return (
    <p className={`text-sm text-red-500 ${className}`} role="alert">
      {message}
    </p>
  );
}

export default ReactFormError;
