type ButtonsProps = {
  classname?: string;
  children: React.ReactNode;
};

function Button({ classname, children }: ButtonsProps) {
  return (
    <button
      className={`bg-yellow-500 px-3 py-2 text-sm tracking-wider text-yellow-50 transition-all hover:bg-yellow-400 xs:px-6 xs:text-base md:inline-block ${classname}`}
    >
      {children}
    </button>
  );
}

export default Button;
