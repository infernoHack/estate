import Skeleton from "react-loading-skeleton";

type CardSkeletonProps = {
  cards: number;
};

function CardSkeleton({ cards }: CardSkeletonProps) {
  return Array.from({ length: cards }, (_, idx) => (
    <li
      className="flex w-full flex-col gap-2 py-3 lg:flex-row lg:gap-4"
      key={idx}
    >
      <div className="flex h-64 items-center lg:h-48 lg:w-64">
        <Skeleton containerClassName="h-[190px] w-[225px]" className="h-full" />
      </div>
      <div className="flex flex-col gap-4 lg:w-3/4 lg:justify-between">
        <div className="text-lg font-semibold">
          <Skeleton />
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="h-full w-28 text-stone-500">
              <Skeleton />
            </span>
          </div>
          <span className="h-full w-20 text-stone-800">
            <Skeleton />
          </span>
        </div>
        <div className="flex w-fit gap-3 font-semibold tracking-wide">
          <div className="w-20 rounded-md border-2 border-yellow-400 px-4 py-2 text-yellow-400">
            <Skeleton />
          </div>
          <div className="rounded-md bg-yellow-400 px-5 py-2 text-yellow-100 transition-all hover:bg-yellow-500">
            Loading...
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 xs:flex-row xs:gap-0">
          <div className="flex gap-4 lg:gap-2">
            <div className="flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1">
              <div className="size-5 lg:w-4" />
              <span className="text-xs">
                <Skeleton />
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1">
              <div className="size-5 lg:w-4" />
              <span className="text-xs">
                <Skeleton />
              </span>
            </div>
          </div>
          <div className="flex gap-4 lg:gap-2">
            <button className="border border-stone-300 p-2 hover:border-stone-500">
              <img src="/save.png" className="size-4" alt="save-img" />
            </button>
            <button className="border border-stone-300 p-2 hover:border-stone-500">
              <img src="/chat.png" className="size-4" alt="chat-img" />
            </button>
          </div>
        </div>
      </div>
    </li>
  ));
}

export default CardSkeleton;
