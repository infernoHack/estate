import { Link } from "react-router-dom";

type ButtonLinkProps = {
  to: string;
  classname?: string;
  children: React.ReactNode;
};

function ButtonLink({ to, classname, children }: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`bg-yellow-500 px-3 py-2 text-sm tracking-wider text-yellow-50 transition-all hover:bg-yellow-400 xs:px-6 xs:text-base sm:tracking-wide md:inline-block ${classname}`}
    >
      {children}
    </Link>
  );
}

export default ButtonLink;
