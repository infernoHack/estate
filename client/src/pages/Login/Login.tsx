import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { useLogin } from "./useLogin";
import ReactFormError from "../../components/ReactFormError";

type FormInputs = {
  username: string;
  password: string;
  singleErrorInput: string;
};

function Login() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormInputs>();

  const [submitError, setsubmitError] = useState<string>("");

  const { mutate, isPending, error } = useLogin();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setsubmitError("");
    mutate(data);
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
    <div className="flex h-[calc(100vh-112px)] w-full">
      <div className="my-auto w-full lg:w-3/5 lg:pr-20">
        <div className="mx-auto flex w-fit flex-col items-center gap-10 px-4 py-6 shadow-all-sm sm:p-8 md:p-12 md:shadow-all-lg">
          <h1 className="text-center text-3xl font-semibold uppercase tracking-wide [word-spacing:0.3rem]">
            Login Into Account
          </h1>
          <form
            className="flex w-full flex-col gap-7"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-2 ">
              <input
                type="text"
                className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                placeholder="Username"
                autoFocus
                {...register("username", { required: "Username is required" })}
              />
              {errors.username?.message && (
                <ReactFormError message={errors.username.message} />
              )}
            </div>
            <div className="space-y-2 ">
              <input
                type="password"
                className="h-12 w-full border-2 px-4 py-2 focus:outline-yellow-500"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Too short. Minimum 5 characters",
                  },
                })}
              />
              {errors.password?.message && (
                <ReactFormError
                  message={errors.password.message}
                  className="ml-1"
                />
              )}
              {submitError && <ReactFormError message={submitError} />}
            </div>
            <button
              className="h-12 w-full border-2 bg-yellow-500 uppercase text-white hover:bg-yellow-400 focus:outline-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300"
              disabled={isSubmitting}
            >
              Sign in
            </button>
            <Link
              to="/register"
              className="*: cursor-pointer text-sm tracking-wide text-indigo-400"
            >
              Didn't have an account ? Create one.
            </Link>
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

export default Login;
