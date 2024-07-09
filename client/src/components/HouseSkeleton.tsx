import Skeleton from "react-loading-skeleton";

function HouseSkeleton() {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-0">
      <div className="flex h-full flex-col gap-7 lg:w-3/5 lg:pr-10">
        <div className="flex h-72 gap-4 lg:h-[360px]">
          <div className="h-full flex-[3]">
            <Skeleton
              containerClassName="h-full w-full"
              className="h-full rounded-md shadow-xl"
            />
          </div>
          <div className="flex h-full flex-1 flex-col justify-between">
            {Array.from({ length: 3 }, (_, idx) => (
              <Skeleton
                key={idx}
                containerClassName="h-20 w-full"
                className="h-full rounded-md shadow-xl"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-7 md:flex-row">
          <div className="space-y-4 md:w-2/3">
            <h1 className="text-3xl">
              <Skeleton />
            </h1>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="h-full w-28">
                  <Skeleton />
                </span>
              </div>
              <span className="h-full w-20">
                <Skeleton />
              </span>
            </div>
            <p className="h-10 w-20 rounded-md bg-yellow-500 px-4 py-2"></p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1 rounded-sm bg-amber-200 p-4 md:w-1/4">
            <Skeleton
              circle
              containerClassName="size-12 lg:size-[56px]"
              className="h-full"
            />
            <span className="w-10">
              <Skeleton />
            </span>
          </div>
        </div>
        <div className="">
          <p>
            <Skeleton count={3} />
          </p>
        </div>
      </div>

      <div className="h-full space-y-4 bg-orange-50 p-3 px-4 lg:w-2/5 lg:pt-0">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">General</h2>
          <div className="space-y-2 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <img
                src="/utility.png"
                className="size-6 bg-yellow-100"
                alt="utilities-img"
              />
              <div className="flex flex-col">
                <h3 className="w-10 font-semibold">
                  <Skeleton />
                </h3>
                <span className="w-20 text-sm">
                  <Skeleton />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/pet.png"
                className="size-6 bg-yellow-100"
                alt="pet-img"
              />
              <div className="flex flex-col">
                <h3 className="w-10">
                  <Skeleton />
                </h3>
                <span className="w-20 text-sm">
                  <Skeleton />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/money.png"
                className="size-6 bg-yellow-100"
                alt="money-img"
              />
              <div className="flex flex-col">
                <h3 className="w-10">
                  <Skeleton />
                </h3>
                <span className="w-20 text-sm">
                  <Skeleton />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Sizes</h2>
          <div className="flex justify-between">
            <div className="flex flex-col items-center gap-2 rounded-md bg-white px-3 py-2 text-center xs:flex-row ">
              <img src="/size.png" className="size-6" alt="size-img" />
              <span className="w-10 text-sm">
                <Skeleton />
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-md bg-white px-3 py-2 text-center xs:flex-row ">
              <img src="/bed.png" className="size-6" alt="bed-img" />
              <span className="w-10 text-sm">
                <Skeleton />
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-md bg-white px-3 py-2 text-center xs:flex-row ">
              <img src="/bath.png" className="size-6" alt="bathtub-img" />
              <span className="w-10 text-sm">
                <Skeleton />
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Nearby Places</h2>
          <div className="flex h-full justify-around bg-white px-4 py-3">
            <div className="h-6 w-12">
              <Skeleton className="size-full" />
            </div>
            <div className="h-6 w-12">
              <Skeleton className="size-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <h2 className="text-lg font-semibold">Location</h2>
          <div className="mx-auto h-40 w-3/4 md:h-96">
            <Skeleton className="h-full" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex w-fit flex-col items-center gap-2 bg-white px-5 py-4 text-center xs:flex-row">
            <img src="/chat.png" className="size-5" alt="chat-icon" />
            <span className="text-sm">Send a message</span>
          </div>
          <div className="flex w-fit flex-col items-center gap-2 bg-white px-5 py-4 text-center xs:flex-row">
            <img src="/save.png" className="size-5" alt="save-icon" />
            <span className="text-sm">Save the place</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseSkeleton;
