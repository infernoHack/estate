import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AxiosError } from "axios";

import { useRegister } from "./useRegister";
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import ReactFormError from "../../components/ReactFormError";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET_NAME = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;

type FormInputs = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  policy: boolean;
  singleErrorInput: string;
};

// Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

// cld.extendConfig({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.REACT_APP_API_KEY,
//   api_secret: process.env.REACT_APP_API_SECRET
// });

function Register() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormInputs>();

  const [avatar, setAvatar] = useState<
    {
      filename: string;
      url: string;
      public_id: string;
    }[]
  >([{ filename: "", url: "", public_id: "" }]);

  const [submitError, setsubmitError] = useState<string>("");

  const deleteImage = async () => {
    // cld.v2.uploader
    //   .destroy(publicId, function (error, result) {
    //     console.log(result, error);
    //   })
    //   .then((resp) => console.log(resp))
    //   .catch((_err) =>
    //     console.log("Something went wrong, please try again later."),
    //   );
    setAvatar([
      {
        filename: "",
        url: "",
        public_id: "",
      },
    ]);
  };

  const { mutate, isPending, error } = useRegister();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setsubmitError("");
    mutate({ data, avatar });
  };

  const isWorking = isPending || isSubmitting;

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

  if (isWorking) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-112px)] w-full ">
      <div className="my-auto w-full lg:w-3/5 lg:pr-28">
        <div className="mx-auto flex w-fit flex-col items-center gap-[33px] px-4 py-4 shadow-all-sm sm:p-8 md:px-10 md:shadow-all-lg">
          <h1 className="text-center text-3xl font-semibold uppercase tracking-wide [word-spacing:0.3rem]">
            Register Your Account
          </h1>
          <form
            className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-1">
              <input
                type="text"
                className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                id="fullname"
                placeholder="Full name"
                autoFocus
                {...register("fullname", { required: "Full name is required" })}
              />
              {errors.fullname?.message && (
                <ReactFormError message={errors.fullname.message} />
              )}
            </div>
            <div className="space-y-1">
              <input
                type="text"
                className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                id="username"
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username?.message && (
                <ReactFormError message={errors.username.message} />
              )}
            </div>
            <div className="space-y-1">
              <input
                type="email"
                className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                id="email"
                placeholder="Email Id"
                {...register("email", { required: "Email Id is required" })}
              />
              {errors.email?.message && (
                <ReactFormError message={errors.email.message} />
              )}
            </div>
            <div className="space-y-1">
              <input
                type="password"
                className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                id="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password?.message && (
                <ReactFormError message={errors.password.message} />
              )}
            </div>

            <div className="flex items-center justify-between border-2 focus:outline-yellow-500 lg:col-span-2">
              <CloudinaryUploadWidget
                uwConfig={{
                  cloudName: CLOUDINARY_CLOUD_NAME,
                  uploadPreset: CLOUDINARY_PRESET_NAME,
                  maxImageFileSize: 2000000,
                  multiple: false,
                  folder: "EliteEstate/avatars",
                }}
                buttonText="Upload"
                buttonStyles={{
                  padding: "8px 24px",
                  fontSize: "14px",
                  borderRadius: "0",
                }}
                renderElement={
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer px-4 text-stone-600"
                  >
                    {avatar[0].filename ? avatar[0].filename : "Avatar"}
                  </label>
                }
                setState={setAvatar}
              />
            </div>
            {avatar[0].url && (
              <div className="relative w-fit lg:col-span-2">
                <img
                  className="border shadow-sm"
                  src={avatar[0].url.replace(
                    "upload/",
                    "upload/c_fill,h_65,w_65/",
                  )}
                />
                <button
                  type="button"
                  className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-stone-100 px-[7px] py-0"
                  onClick={deleteImage}
                >
                  x
                </button>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4"
                  id="policy"
                  {...register("policy", {
                    required: "Confirmation is required",
                  })}
                />
                <label htmlFor="policy" className="text-sm text-stone-600">
                  I agree to all the terms and conditions.
                </label>
              </div>
              {errors.policy?.message && (
                <ReactFormError message={errors.policy.message} />
              )}
            </div>
            {submitError && <ReactFormError message={submitError} />}
            <button
              className="h-12 w-full border-2 bg-yellow-500 uppercase text-white hover:bg-yellow-400 focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300 lg:col-span-2"
              disabled={isSubmitting}
            >
              Sign up
            </button>
          </form>
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

export default Register;
