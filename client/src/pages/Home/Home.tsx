import Searchbar from "../../components/Searchbar";

function Home() {
  return (
    <div className="flex min-h-[calc(100vh-112px)]">
      <div className="w-full py-5 lg:w-3/5 lg:pr-24">
        <div className="flex flex-col gap-12">
          <h1 className="text-4xl font-semibold md:text-5xl lg:text-6xl">
            Find Real Estate & Get Your Dream Place
          </h1>
          <p className="text-justify ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            explicabo suscipit cum eius, iure est nulla animi consequatur
            facilis id pariatur fugit quos laudantium temporibus dolor ea
            repellat provident impedit!
          </p>
          <Searchbar />
          <div className="flex justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                16+
              </h3>
              <p className="text-sm tracking-wide text-stone-700 lg:text-lg lg:text-stone-600">
                Years of Experience
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                200
              </h3>
              <p className="text-sm tracking-wide text-stone-700 lg:text-lg lg:text-stone-600">
                Award Gained
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                2000+
              </h3>
              <p className="text-sm tracking-wide text-stone-700 lg:text-lg lg:text-stone-600">
                Property Ready
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden w-2/5 items-center bg-orange-50 lg:flex">
        <img
          src="/bg.png"
          className="absolute right-0 max-h-full w-[110%] max-w-none xl:w-[115%]"
          alt="buildings-img"
        />
      </div>
    </div>
  );
}

export default Home;
