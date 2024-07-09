import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

import { useCreatePost } from "./useCreatePost";
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import ReactFormError from "../../components/ReactFormError";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET_NAME = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;

type FormInputs = {
  title: string;
  price: number;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  transaction: string;
  property: string;
  house: number;
  bedrooms: number;
  bathrooms: number;
  utilites: boolean;
  petPolicy: boolean;
  income: boolean;
  nearbyPlaces: { key: string; value: string }[];
  images: {
    filename: string;
    url: string;
    public_id: string;
  }[];

  singleErrorInput: string;
};

function NewPost() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<FormInputs>();

  const { mutate, isPending, error } = useCreatePost();

  const [submitError, setsubmitError] = useState<string>("");

  const [nearbyPlaces, setNearbyPlaces] = useState<
    { key: string; value: string }[]
  >([]);

  const [currNearbyPlace, setCurrNearbyPlace] = useState<{
    key: string;
    value: string;
  }>({ key: "", value: "" });

  const [images, setImages] = useState<
    {
      filename: string;
      url: string;
      public_id: string;
    }[]
  >([]);

  const deleteimages = (public_id: string) => {
    setImages((state) =>
      state.filter((image) => image.public_id !== public_id),
    );
  };

  const handleCurrNearbyPlace = (key: string, value = "") => {
    if (key && isNaN(Number(value)) === false) {
      setCurrNearbyPlace({ key, value });
    }
  };

  const handleNearbyPlaces = (key: string) => {
    if (
      nearbyPlaces.map((item) => item.key).includes(key) ||
      currNearbyPlace.value === "" ||
      nearbyPlaces.length === 4
    ) {
      return;
    }

    const newPlace = {
      key: currNearbyPlace.key,
      value: currNearbyPlace.value + "km away",
    };
    setNearbyPlaces((state) => [...state, newPlace]);
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const finalData = {
      title: data.title,
      price: Number(data.price),
      city: data.city,
      address: data.address,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      description: data.description,
      transaction: data.transaction,
      property: data.property,
      features: {
        general: {
          utilites: Boolean(Number(data.utilites)),
          petPolicy: Boolean(Number(data.petPolicy)),
          income: Boolean(Number(data.income)),
        },
        sizes: {
          house: Number(data.house),
          bedrooms: Number(data.bedrooms),
          bathrooms: Number(data.bathrooms),
        },
        nearbyPlaces,
      },
      images,
    };

    setsubmitError("");
    mutate(finalData);
    // reset(undefined, { keepValues: true });
  };

  useEffect(() => {
    if (error) {
      let errorMessage = "An error occured";
      if (error instanceof AxiosError) {
        if (error?.response?.data) {
          errorMessage = `${error.response.data}`;
        } else {
          errorMessage = `${error.message}`;
        }
      }
      setsubmitError(errorMessage);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-6 lg:h-[calc(100vh-112px)] lg:flex-row lg:gap-0">
      <div className="flex h-full w-full flex-col gap-8 py-3 md:pb-10 lg:w-3/5 lg:overflow-auto lg:pr-24">
        <h1 className="text-2xl font-light xs:text-3xl">Add New Post</h1>
        <form
          className="flex flex-col justify-between gap-x-5 gap-y-7"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-3">
            <h2 className="text-xl font-light xs:text-2xl">Basic Details</h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 xs:grid-cols-2 md:grid-cols-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="title" className="ml-1 text-sm text-stone-700">
                  Title
                </label>
                <input
                  type="text"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="title"
                  placeholder="Title"
                  autoFocus
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title?.message && (
                  <ReactFormError
                    message={errors.title.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="price" className="ml-1 text-sm text-stone-700">
                  Price
                </label>
                <input
                  type="number"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="price"
                  placeholder="Price"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },
                  })}
                />
                {errors.price?.message && (
                  <ReactFormError
                    message={errors.price.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="city" className="ml-1 text-sm text-stone-700">
                  City
                </label>
                <input
                  type="text"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="city"
                  placeholder="City"
                  {...register("city", { required: "City is required" })}
                />
                {errors.city?.message && (
                  <ReactFormError
                    message={errors.city.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label
                  htmlFor="address"
                  className="ml-1 text-sm text-stone-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="address"
                  placeholder="Address"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address?.message && (
                  <ReactFormError
                    message={errors.address.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="latitude"
                  className="ml-1 text-sm text-stone-700"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="latitude"
                  placeholder="Latitude"
                  {...register("latitude", {
                    required: "Latitude is required",
                  })}
                />
                {errors.latitude?.message && (
                  <ReactFormError
                    message={errors.latitude.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="longitude"
                  className="ml-1 text-sm text-stone-700"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="longitude"
                  placeholder="Longitude"
                  {...register("longitude", {
                    required: "Longitude is required",
                  })}
                />
                {errors.longitude?.message && (
                  <ReactFormError
                    message={errors.longitude.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 xs:col-span-full">
                <label
                  htmlFor="description"
                  className="ml-1 text-sm text-stone-700"
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="description"
                  placeholder="Description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description?.message && (
                  <ReactFormError
                    message={errors.description.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="transaction"
                  className="ml-1 text-sm text-stone-700"
                >
                  Transaction
                </label>
                <select
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="transaction"
                  {...register("transaction", {
                    required: "Transaction Type is required",
                  })}
                >
                  <option value="" hidden>
                    Select
                  </option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
                {errors.transaction?.message && (
                  <ReactFormError
                    message={errors.transaction.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="property"
                  className="ml-1 text-sm text-stone-700"
                >
                  Property
                </label>
                <select
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="property"
                  {...register("property", {
                    required: "Property Type is required",
                  })}
                >
                  <option value="" hidden>
                    Select
                  </option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
                {errors.property?.message && (
                  <ReactFormError
                    message={errors.property.message}
                    className="ml-1"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-light xs:text-2xl">Sizes</h2>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="house" className="ml-1 text-sm text-stone-700">
                  House (in sqft)
                </label>
                <input
                  type="number"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="house"
                  placeholder="House"
                  {...register("house", {
                    required: "House size is required",
                    min: {
                      value: 1,
                      message: "House size must be greater than zero",
                    },
                  })}
                />
                {errors.house?.message && (
                  <ReactFormError
                    message={errors.house.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bedrooms"
                  className="ml-1 text-sm text-stone-700"
                >
                  No. of bedrooms
                </label>
                <input
                  type="number"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="bedrooms"
                  placeholder="Bedrooms"
                  {...register("bedrooms", {
                    required: "Bedrooms are required",
                    min: {
                      value: 1,
                      message: "Bedrooms must be greater than 0",
                    },
                  })}
                />
                {errors.bedrooms?.message && (
                  <ReactFormError
                    message={errors.bedrooms.message}
                    className="ml-1"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bathrooms"
                  className="ml-1 text-sm text-stone-700"
                >
                  No. of bathrooms
                </label>
                <input
                  type="number"
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                  id="bathrooms"
                  placeholder="Bathrooms"
                  {...register("bathrooms", {
                    required: "Bathrooms are required",
                    min: {
                      value: 1,
                      message: "Bathrooms must be greater than 0",
                    },
                  })}
                />
                {errors.bathrooms?.message && (
                  <ReactFormError
                    message={errors.bathrooms.message}
                    className="ml-1"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-light xs:text-2xl">General</h2>
            <div className=" space-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone-700">
                  Is tentant responsible for utilities ?
                </span>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="cursor-pointer accent-yellow-500"
                      id="utilitesYes"
                      value={1}
                      {...register("utilites", { required: "Select one" })}
                    />
                    <label className="cursor-pointer" htmlFor="utilitesYes">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="cursor-pointer accent-yellow-500"
                      id="utilitesNo"
                      value={0}
                      {...register("utilites", { required: "Select one" })}
                    />
                    <label className="cursor-pointer" htmlFor="utilitesNo">
                      No
                    </label>
                  </div>
                  {errors.utilites?.message && (
                    <ReactFormError
                      message={errors.utilites.message}
                      className="w-16"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone-700">Are pets allowed ?</span>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="cursor-pointer accent-yellow-500"
                      id="petYes"
                      value={1}
                      {...register("petPolicy", { required: "Select one" })}
                    />
                    <label className="cursor-pointer" htmlFor="petYes">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="cursor-pointer accent-yellow-500"
                      id="petNo"
                      value={0}
                      {...register("petPolicy", { required: "Select one" })}
                    />
                    <label className="cursor-pointer" htmlFor="petNo">
                      No
                    </label>
                  </div>
                  {errors.petPolicy?.message && (
                    <ReactFormError
                      message={errors.petPolicy.message}
                      className="w-16"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone-700">
                  Are economic activities allowed ?
                </span>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="cursor-pointer accent-yellow-500"
                      id="incomeYes"
                      value={1}
                      {...register("income", { required: "Select one" })}
                    />
                    <label className="cursor-pointer" htmlFor="incomeYes">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="cursor-pointer accent-yellow-500"
                      id="incomeNo"
                      value={0}
                      {...register("income", { required: "Select one" })}
                    />
                    <label className="cursor-pointer" htmlFor="incomeNo">
                      No
                    </label>
                  </div>
                  {errors.income?.message && (
                    <ReactFormError
                      message={errors.income.message}
                      className="w-16"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-light xs:text-2xl">Nearby Places</h2>
            <div className="space-y-3">
              <p className="ml-1 text-stone-700">Choose at most 3 places</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <select
                  className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500 sm:w-1/3"
                  id="nearbyPlaces"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleCurrNearbyPlace(e.target.value)
                  }
                  disabled={nearbyPlaces.length === 3}
                >
                  <option value="" hidden>
                    Select
                  </option>
                  <option
                    disabled={nearbyPlaces
                      .map((item) => item.key)
                      .includes("School")}
                  >
                    School
                  </option>
                  <option
                    disabled={nearbyPlaces
                      .map((item) => item.key)
                      .includes("Bus Stop")}
                  >
                    Bus Stop
                  </option>
                  <option
                    disabled={nearbyPlaces
                      .map((item) => item.key)
                      .includes("Restaurant")}
                  >
                    Restaurant
                  </option>
                  <option
                    disabled={nearbyPlaces
                      .map((item) => item.key)
                      .includes("Hospital")}
                  >
                    Hospital
                  </option>
                </select>
                {currNearbyPlace.key && (
                  <div className="min-h-12 w-full flex-1 divide-x divide-stone-300 border-2 focus:outline-yellow-500 sm:flex">
                    <div className="flex h-1/2 min-h-12 divide-x divide-stone-300 sm:flex-1">
                      <label
                        htmlFor="currNearbyPlace"
                        className="flex h-12 min-w-[85px] items-center justify-center text-sm xs:w-1/3"
                      >
                        {currNearbyPlace.key}
                      </label>
                      <input
                        type="text"
                        className="h-12 w-full pl-3 focus:outline-none"
                        id="currNearbyPlace"
                        placeholder="Distance in km"
                        value={currNearbyPlace.value}
                        onChange={(e) =>
                          handleCurrNearbyPlace(
                            currNearbyPlace.key,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <button
                      className="h-12 w-full min-w-[100px] bg-yellow-500 text-sm uppercase text-white hover:bg-yellow-400 focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 sm:w-1/3"
                      type="button"
                      onClick={() => handleNearbyPlaces(currNearbyPlace.key)}
                    >
                      Add Place
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                {nearbyPlaces.map((item) => (
                  <div
                    key={item.key}
                    className="flex w-fit gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm text-yellow-500"
                  >
                    <span>{item.key}</span>
                    <span>({item.value})</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNearbyPlaces((state) =>
                          state.filter((place) => place.key !== item.key),
                        )
                      }
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden gap-1 lg:flex">
            <button
              className="h-12 w-1/2 border-2 bg-yellow-500 uppercase text-white hover:bg-yellow-400 focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
              disabled={isSubmitting || isPending}
            >
              Add Post
            </button>
            <Link
              className="flex h-12 w-1/2  items-center justify-center border-2 uppercase text-yellow-500 hover:bg-yellow-500 hover:text-white focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
              to="/profile"
            >
              Go back
            </Link>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 lg:h-[calc(100vh-112px)] lg:w-2/5 lg:bg-orange-50">
        <div className="flex flex-wrap justify-center gap-3">
          {images.map((item) => (
            <div className="relative h-[90px] w-[120px]" key={item.public_id}>
              <img
                className="w-full object-cover p-2 shadow-md"
                src={item.url.replace("upload/", "upload/c_fill,h_90,w_120/")}
                alt="house-image"
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-stone-200 px-2 py-[2px] font-semibold opacity-70 mix-blend-plus-darker hover:opacity-100"
                onClick={() => deleteimages(item.public_id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-center">
          <CloudinaryUploadWidget
            uwConfig={{
              cloudName: CLOUDINARY_CLOUD_NAME,
              uploadPreset: CLOUDINARY_PRESET_NAME,
              multiple: true,
              folder: "EliteEstate/house",
            }}
            buttonText="Add images"
            buttonStyles={{
              padding: "10px 24px",
              fontSize: "15px",
              borderRadius: "0",
              ...(nearbyPlaces.length === 4 && {
                backgroundColor: "rgb(0 120 255 / 50%)",
                cursor: "not-allowed",
              }),
            }}
            setState={setImages}
            disabled={nearbyPlaces.length === 4 || isSubmitting || isPending}
          />
          <p className="text-xs">(Max limit 4)</p>
        </div>
      </div>
      <form
        className="flex flex-col justify-between gap-4 lg:hidden"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="mb-6 mt-3 flex gap-1">
          <button
            className="h-12 w-1/2 border-2 bg-yellow-500 uppercase text-white hover:bg-yellow-400 focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
            disabled={isSubmitting || isPending}
          >
            Add Post
          </button>
          <Link
            className="flex h-12 w-1/2  items-center justify-center border-2 uppercase text-yellow-500 hover:bg-yellow-500 hover:text-white focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
            to="/profile"
          >
            Go back
          </Link>
        </div>
      </form>
    </div>
  );
}

export default NewPost;
