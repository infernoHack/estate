import { useLocation } from "react-router-dom";

import { useHouseListPage } from "./useHouseListPage";
import Filter from "../../components/Filter";
import Card from "../../components/Card";
import LocationMap from "../../components/LocationMap";
import CardSkeleton from "../../components/CardSkeleton";
import Skeleton from "react-loading-skeleton";

function HouseListPage() {
  const { search: queryString } = useLocation();

  const { data: listData, isPending, error } = useHouseListPage(queryString);

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-112px)] lg:flex-row lg:gap-0">
      <div className="order-3 flex min-h-[50%] w-full flex-col gap-12 lg:order-1 lg:w-3/5 lg:overflow-auto lg:pr-8">
        <Filter />
        <ul className="mb-8 flex flex-col lg:divide-y lg:divide-stone-100">
          {listData === undefined || isPending ? (
            <CardSkeleton cards={4} />
          ) : (
            listData.map((item) => (
              <Card key={item.id} item={{ ...item, image: item.images[0] }} />
            ))
          )}
        </ul>
      </div>

      <div className="order-2 hidden h-full w-full bg-orange-50 xs:block lg:w-2/5 lg:p-5">
        <div className="h-96 w-full rounded-md shadow-xl lg:h-[450px]">
          {listData === undefined || isPending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <LocationMap
              data={listData?.map((item) => ({
                id: item.id,
                title: item.title,
                latitude: item.latitude,
                longitude: item.longitude,
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HouseListPage;
