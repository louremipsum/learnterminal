import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/dashboard"} className="text-slate-700 font-semibold text-md">
      <span className="animate-pulse text-lg text-green-600 mr-2">&gt;</span>
      <span>Mainframe</span>
      {/* <span className="inline-block overflow-hidden whitespace-nowrap font-mono animate-typing border-r-4">
        Mainframe
      </span> */}
    </Link>
  );
};

export default Logo;
