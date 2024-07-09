import { useState } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "../../redux/store";
import { useHousePage } from "./useHousePage";
import { useUserSavedPost } from "./useUserSavedPost";
import Slider from "../../components/Slider";
import LocationMap from "../../components/LocationMap";
import {
  capitalizeAllWords,
  capitalizeParagraph,
  capitalizeSentence,
  capitalizeWord,
} from "../../utils";
import HouseSkeleton from "../../components/HouseSkeleton";

const nearbyPlacesImage = [
  { key: "School", img: "/school.png" },
  { key: "Bus Stop", img: "/bus.png" },
  { key: "Restaurant", img: "/restaurant.png" },
  { key: "Hospital", img: "/hospital.png" },
];

function HousePage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: houseData,
    isPending: isLoadingHouse,
    error: houseLoadingError,
  } = useHousePage(id!);

  const {
    mutate,
    isPending: isUpdatingSavedPost,
    error: savedPostUpdatingError,
  } = useUserSavedPost();

  const user = useAppSelector((state) => state.user).currentUser;

  const [sliderIdx, setSliderIdx] = useState<null | number>(null);

  const handleSliderIdx = (val: string) => {
    if (val == "prev") {
      setSliderIdx((state) =>
        state === 0 ? houseData!.images.length - 1 : state! - 1,
      );
    } else if (val == "next") {
      setSliderIdx((state) =>
        state === houseData!.images.length - 1 ? 0 : state! + 1,
      );
    } else if (val === "null") {
      setSliderIdx(null);
    } else {
      setSliderIdx(parseInt(val));
    }
  };

  return houseData === undefined || isLoadingHouse ? (
    <HouseSkeleton />
  ) : sliderIdx !== null ? (
    <Slider
      images={houseData.images.map((item) => ({
        url: item.url,
      }))}
      sliderIdx={sliderIdx}
      handleSliderIdx={handleSliderIdx}
    />
  ) : (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-0">
      <div className="flex h-full flex-col gap-7 lg:w-3/5 lg:pr-10">
        <div className="flex h-72 gap-4 lg:h-[360px]">
          <div className="h-full flex-[3]" onClick={() => handleSliderIdx("0")}>
            <img
              src={houseData.images[0].url}
              className="h-full w-full cursor-pointer rounded-md object-cover shadow-xl transition-all duration-300 hover:scale-[1.01]"
              alt="house-img"
            />
          </div>
          <div className="flex h-full flex-1 flex-col justify-between">
            {houseData.images.slice(1).map((item, idx) => (
              <img
                className="h-20 w-full cursor-pointer rounded-md object-cover shadow-xl transition-all duration-300 hover:scale-[1.01] lg:h-28"
                src={item.url}
                key={item.public_id}
                alt="house-img"
                onClick={() => handleSliderIdx((idx + 1).toString())}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-7 md:flex-row">
          <div className="space-y-4 md:w-2/3">
            <h1 className="text-3xl font-medium">{houseData.title}</h1>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <img src="/pin.png" className="size-4" alt="location-pin-img" />
                <span className="text-sm text-stone-700">
                  {houseData.address}
                </span>
              </div>
              <span className="text-lg text-yellow-500">
                ({capitalizeWord(houseData.transaction)} /{" "}
                {capitalizeWord(houseData.property)})
              </span>
            </div>
            <p className="w-fit rounded-md bg-yellow-500 px-4 py-2 tracking-wide text-white">
              $ {houseData.price}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1 rounded-sm bg-amber-200 p-4 md:w-1/4">
            <img
              src={houseData.user.avatar?.url || "/noavatar.jpg"}
              className="size-12 rounded-full object-cover lg:size-[56px]"
              alt="owner-img"
            />
            <span>{houseData.user?.fullname}</span>
          </div>
        </div>
        <div className="break-words text-justify text-stone-700">
          <p>{capitalizeParagraph(houseData.description)}</p>
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
                <h3 className="font-semibold text-stone-800">
                  {capitalizeAllWords("utilities")}
                </h3>
                <span className="text-sm text-stone-600">
                  {capitalizeSentence(
                    houseData.features.general.utilites
                      ? "tenant is responsible"
                      : "tenant is not responsible",
                  )}
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
                <h3 className="font-semibold text-stone-800">
                  {capitalizeAllWords("pet policy")}
                </h3>
                <span className="text-sm text-stone-600">
                  {capitalizeSentence(
                    houseData.features.general.petPolicy
                      ? "pets are allowed"
                      : "pets are not allowed",
                  )}
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
                <h3 className="font-semibold text-stone-800">
                  {capitalizeAllWords("income")}
                </h3>
                <span className="text-sm text-stone-600">
                  {capitalizeSentence(
                    houseData.features.general.income
                      ? "economic activites are allowed"
                      : "economic activites are not allowed",
                  )}
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
              <span className="text-sm">
                {houseData.features.sizes.house} sqft
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-md bg-white px-3 py-2 text-center xs:flex-row ">
              <img src="/bed.png" className="size-6" alt="bed-img" />
              <span className="text-sm">
                {houseData.features.sizes.bedrooms} bedroom(s)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-md bg-white px-3 py-2 text-center xs:flex-row ">
              <img src="/bath.png" className="size-6" alt="bathtub-img" />
              <span className="text-sm">
                {houseData.features.sizes.bathrooms} bathroom(s)
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Nearby Places</h2>
          <div className="flex h-full items-center justify-between bg-white px-4 py-3">
            {houseData.features.nearbyPlaces.map((item) => (
              <div
                className="flex h-full flex-col items-center gap-2 text-center xs:flex-row xs:text-left"
                key={item.key}
              >
                <img
                  src={
                    nearbyPlacesImage.find((place) => place.key === item.key)
                      ?.img
                  }
                  className="size-6 bg-yellow-100"
                  alt={`${item.key}-img`}
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-stone-800">
                    {capitalizeAllWords(item.key)}
                  </h3>
                  <span className="text-sm text-stone-600">
                    {capitalizeSentence(item.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <h2 className="text-lg font-semibold">Location</h2>
          <div className="h-96 w-full">
            <LocationMap
              data={[houseData].map((item) => ({
                id: item.id,
                title: item.title,
                latitude: item.latitude,
                longitude: item.longitude,
              }))}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button className="flex w-fit flex-col items-center gap-2 bg-white px-5 py-4 text-center xs:flex-row">
            <img src="/chat.png" className="size-5" alt="chat-icon" />
            <span className="text-sm">Send a message</span>
          </button>
          <button
            className="flex w-fit flex-col items-center gap-2 bg-white px-5 py-4 text-center disabled:cursor-not-allowed xs:flex-row"
            onClick={() => mutate(id!)}
            disabled={isUpdatingSavedPost}
          >
            <img src="/save.png" className="size-5" alt="save-icon" />
            <span className="text-sm">
              {user?.savedPosts.map((item) => item.id).includes(id!)
                ? "Unsave the place"
                : "Save the place"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HousePage;
