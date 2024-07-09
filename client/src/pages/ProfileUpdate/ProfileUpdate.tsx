import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

import { useAppSelector } from "../../redux/store";
import { useUpdateProfile } from "./useUpdateProfile";
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import ReactFormError from "../../components/ReactFormError";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET_NAME = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;

const DISPLAY_PASSWORD = ".......";

type FormInputs = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  policy: boolean;
  singleErrorInput: string;
};

function ProfileUpdate() {
  const user = useAppSelector((state) => state.user).currentUser;

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormInputs>({
    defaultValues: {
      username: user?.username,
      fullname: user?.fullname,
      email: user?.email,
      password: DISPLAY_PASSWORD,
    },
  });

  const [submitError, setsubmitError] = useState<string>("");

  const [avatar, setAvatar] = useState<
    {
      filename: string;
      url: string;
      public_id: string;
    }[]
  >([
    {
      filename: user?.avatar?.filename ?? "",
      url: user?.avatar?.url ?? "",
      public_id: user?.avatar?.public_id ?? "",
    },
  ]);

  const deleteAvatar = () => {
    setAvatar([
      {
        filename: "",
        url: "",
        public_id: "",
      },
    ]);
  };

  const { mutate, isPending, error } = useUpdateProfile(user, avatar);

  const isWorking = isPending || isSubmitting;

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const finalData = {
      fullname: data.fullname,
      email: data.email,
      ...(data.password !== DISPLAY_PASSWORD && {
        password: data.password,
      }),
    };

    setsubmitError("");
    mutate(finalData);
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
      <div className="flex h-full w-full flex-col gap-7 py-3 lg:w-3/5 lg:pr-28">
        <h1 className="text-2xl font-light xs:text-3xl">Update Information</h1>
        <form
          className="flex flex-col justify-between gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-1">
            <label htmlFor="username" className="mx-1 text-stone-600">
              Username
            </label>
            <input
              type="text"
              className="h-12 w-full cursor-not-allowed rounded-sm border-2 bg-gray-100 px-4 py-2"
              id="username"
              placeholder="Username"
              {...register("username")}
              disabled
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="fullname" className="mx-1 text-stone-600">
              Full name
            </label>
            <input
              type="text"
              className="h-12 w-full rounded-sm border-2 px-4 py-2 focus:outline-yellow-500"
              id="fullname"
              placeholder="Full name"
              {...register("fullname", { required: "Full name is required" })}
            />
            {errors.fullname?.message && (
              <ReactFormError
                message={errors.fullname.message}
                className="ml-1"
              />
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="mx-1 text-stone-600">
              Email Id
            </label>
            <input
              type="email"
              className="h-12 w-full rounded-sm border-2 px-4 py-2 focus:outline-yellow-500"
              id="email"
              placeholder="Email Id"
              {...register("email", { required: "Email Id is required" })}
            />
            {errors.email?.message && (
              <ReactFormError message={errors.email.message} />
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="mx-1 text-stone-600">
              Password
            </label>
            <input
              type="password"
              className="h-12 w-full rounded-sm border-2 px-4 py-2 focus:outline-yellow-500"
              id="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password should be more than 3 characters",
                },
              })}
            />
            {errors.password?.message && (
              <ReactFormError message={errors.password.message} />
            )}
          </div>
          <div className="mt-2 hidden gap-1 lg:flex">
            <button
              className="h-12 w-1/2 border-2 bg-yellow-500 uppercase text-white hover:bg-yellow-400 focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
              disabled={isWorking}
            >
              Update
            </button>
            <Link
              className="flex h-12 w-1/2  items-center justify-center border-2 uppercase text-yellow-500 hover:bg-yellow-500 hover:text-white focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
              to="/profile"
            >
              Go back
            </Link>
          </div>
          {submitError && <ReactFormError message={submitError} />}
        </form>
      </div>

      <div className="flex h-full flex-col items-center justify-center gap-8 lg:w-2/5 lg:bg-orange-50">
        <div className="relative flex w-[110px] justify-center lg:col-span-2">
          <img
            className="w-full p-2 shadow-md"
            src={
              avatar[0].url
                ? avatar[0].url.replace("upload/", "upload/c_fill,h_50,w_50/")
                : "/noavatar.jpg"
            }
            alt="avatar"
          />
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-stone-200 px-2 py-[2px] font-semibold opacity-70 mix-blend-plus-darker hover:opacity-100"
            onClick={deleteAvatar}
          >
            X
          </button>
        </div>
        <CloudinaryUploadWidget
          uwConfig={{
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_PRESET_NAME,
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "EliteEstate/avatars",
          }}
          buttonText={`${user?.avatar?.filename ? "Change" : "Upload"} Avatar`}
          buttonStyles={{
            padding: "10px 24px",
            fontSize: "15px",
            borderRadius: "0",
          }}
          setState={setAvatar}
        />
      </div>
      <form
        className="flex flex-col justify-between gap-4 lg:hidden"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="mb-6 mt-3 flex gap-1">
          <button
            className="h-12 w-1/2 border-2 bg-yellow-500 uppercase text-white hover:bg-yellow-400 focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
            disabled={isWorking}
          >
            Update
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

export default ProfileUpdate;
