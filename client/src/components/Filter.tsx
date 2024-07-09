import { useSearchParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  city: string;
  transaction: string;
  property: string;
  bedrooms: number;
  minPrice: number;
  maxPrice: number;
};

const MAX_PRICE = 100000000000;

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const city = searchParams.get("city") || "";
  const transaction = searchParams.get("transaction") || "";
  const property = searchParams.get("property") || "";
  const bedrooms = parseInt(searchParams.get("bedrooms") || "1");
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || `${MAX_PRICE}`);

  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<FormInputs>({
    defaultValues: {
      city,
      transaction,
      property,
      bedrooms,
      minPrice,
      maxPrice,
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { city, transaction, property, bedrooms, minPrice, maxPrice } = data;

    const definedSearchParams = {
      ...(city && { city: city }),
      ...(transaction && { transaction: transaction }),
      ...(property && { property: property }),
      ...(bedrooms != 1 && { bedrooms: bedrooms.toString() }),
      ...(minPrice != 0 && { minPrice: minPrice.toString() }),
      ...(maxPrice != MAX_PRICE && {
        maxPrice: maxPrice.toString(),
      }),
    };

    setSearchParams(definedSearchParams);
  };

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h1 className="text-2xl font-light">
        Search results{" "}
        {city && (
          <span>
            for <b>{city}</b>
          </span>
        )}
      </h1>
      <div className="flex flex-col">
        <label htmlFor="city" className="text-xs">
          Location
        </label>
        <input
          type="text"
          className="border border-stone-300 px-3 py-2 hover:border-stone-600"
          id="city"
          placeholder="City location"
          {...register("city")}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className=" flex flex-col">
          <label htmlFor="Transaction" className="text-xs">
            Transaction
          </label>
          <select
            className=" border border-stone-300 px-3 py-2 hover:border-stone-600"
            id="transaction"
            {...register("transaction")}
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="property" className="text-xs">
            Property
          </label>
          <select
            className=" border border-stone-300 px-3 py-2 hover:border-stone-600"
            id="property"
            {...register("property")}
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="bedrooms" className="text-xs">
            Bedrooms
          </label>
          <input
            type="number"
            className=" border border-stone-300 px-3 py-2 hover:border-stone-600"
            id="bedrooms"
            {...register("bedrooms", {
              min: {
                value: 1,
                message: "Can't be less than 1",
              },
            })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="minPrice" className="text-xs">
            Min Price
          </label>
          <input
            type="number"
            className="border border-stone-300 px-3 py-2 hover:border-stone-600"
            id="minPrice"
            {...register("minPrice", {
              min: {
                value: 0,
                message: "Can't be less than 0",
              },
            })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="maxPrice" className="text-xs">
            Max Price
          </label>
          <input
            type="number"
            className=" border border-stone-300 px-3 py-2 hover:border-stone-600"
            id="maxPrice"
            {...register("maxPrice", {
              min: {
                value: 1,
                message: "Can't be less than 1",
              },
            })}
          />
        </div>
        <button
          className="border:bg-yellow-500 flex cursor-pointer items-center justify-center self-end bg-yellow-400 p-3 hover:bg-yellow-500 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          <img src="/search.png" className="size-5" alt="search-icon" />
        </button>
      </div>
    </form>
  );
}

export default Filter;
