import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  city: string;
  minPrice: number;
  maxPrice: number;
};

function Searchbar() {
  const { register, handleSubmit } = useForm<FormInputs>();

  const [action, setAction] = useState<"buy" | "rent">("buy");

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const { city, minPrice, maxPrice } = data;

    const queryString = [
      city ? `city=${city}` : "",
      minPrice ? `minPrice=${minPrice}` : "",
      maxPrice ? `maxPrice=${maxPrice}` : "",
    ]
      .filter(Boolean)
      .join("&");

    navigate(`/post/list?${queryString}`);
  };

  return (
    <div className="w-full">
      <div>
        <button
          className={`${action === "buy" ? "bg-black text-white" : ""} mb-0 rounded-tl-md border border-b-0 border-r-0 border-stone-400 px-8 py-4 text-sm capitalize hover:font-semibold md:px-9 md:py-4 md:text-base`}
          onClick={() => setAction("buy")}
        >
          buy
        </button>
        <button
          className={`${action === "rent" ? "bg-black text-white" : ""} mb-0 rounded-tr-md border border-b-0 border-l-0 border-stone-400 px-8 py-4 text-sm capitalize hover:font-semibold md:px-9 md:py-4 md:text-base`}
          onClick={() => setAction("rent")}
        >
          rent
        </button>
      </div>
      <form
        action="/post/list"
        className="flex w-full flex-col gap-4 md:flex-row md:items-center md:gap-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          id="city"
          placeholder="City Location"
          className="flex-1 border border-stone-500 px-4 py-4 text-sm placeholder:text-stone-500 hover:border-2 hover:border-r md:border-r-0 lg:max-w-[33.333333%]"
          {...register("city")}
        />
        <input
          type="number"
          id="minPrice"
          placeholder="Min Price"
          className="border border-stone-500 px-4 py-4 text-sm placeholder:text-stone-500 hover:border-2 lg:max-w-[33.333333%]"
          {...register("minPrice", {
            min: { value: 0, message: "Price can't be less than 0" },
          })}
        />
        <input
          type="number"
          id="maxPrice"
          placeholder="Max Price"
          className="border border-stone-500 px-4 py-4 text-sm placeholder:text-stone-500 hover:border-2 hover:border-l md:border-l-0 lg:max-w-[33.333333%]"
          {...register("maxPrice")}
        />
        <button
          type="submit"
          className="bg-yellow-400 p-4 transition-all hover:bg-yellow-500"
        >
          <img
            src="/search.png"
            className="mx-auto size-5 max-w-none md:size-6"
            alt="search-icon"
          />
        </button>
      </form>
    </div>
  );
}

export default Searchbar;
