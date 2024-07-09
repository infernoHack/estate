import { FormEvent } from "react";

import { useAppSelector } from "../../redux/store";
import { useUser } from "./useUser";
import { useLogout } from "./useLogout";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Chat from "../../components/Chat/Chat";
import ButtonLink from "../../components/ButtonLink";
import CardSkeleton from "../../components/CardSkeleton";

function Profile() {
  const user = useAppSelector((state) => state.user.currentUser)!;

  const {
    data: userData,
    isPending: isLoadingUser,
    error: userDataError,
  } = useUser(user.id);

  const { mutate, isPending: isLoggingOut, error: logoutError } = useLogout();

  const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-112px)] lg:flex-row">
      <div className="flex h-full w-full flex-col gap-12 pb-10 lg:w-3/5 lg:overflow-auto lg:pr-12">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-light xs:text-3xl">
              User Information
            </h2>
            <ButtonLink to="/profile/update" classname="text-center">
              Update Profile
            </ButtonLink>
          </div>
          <ul className="flex flex-col justify-between gap-4">
            <li className="flex items-center">
              <span className="w-1/3 md:w-1/6">Avatar:</span>
              <img
                src={user?.avatar?.url || "/noavatar.jpg"}
                className="size-8 rounded-full object-cover"
                alt="user-avatar"
              />
            </li>
            <li className="flex items-center">
              <span className="w-1/3 md:w-1/6">Username:</span>
              <span>{user?.username}</span>
            </li>
            <li className="flex items-center">
              <span className="w-1/3 md:w-1/6">Full Name:</span>
              <span>{user?.fullname}</span>
            </li>
            <li className="flex items-center">
              <span className="w-1/3 md:w-1/6">Email Id:</span>
              <span>{user?.email}</span>
            </li>
          </ul>
          <form onSubmit={handleLogout}>
            <Button classname="lg:w-1/5">Logout</Button>
          </form>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light xs:text-3xl">My List</h2>
            <ButtonLink to="/post/new">Add New Post</ButtonLink>
          </div>
          <ul>
            {userData === undefined || isLoadingUser ? (
              <CardSkeleton cards={2} />
            ) : (
              userData.posts.map((item) => (
                <Card
                  item={{ ...item, user, image: item.images[0] }}
                  key={item.id}
                />
              ))
            )}
          </ul>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light xs:text-3xl">Saved List</h2>
          </div>
          <ul>
            {userData === undefined || isLoadingUser ? (
              <CardSkeleton cards={2} />
            ) : (
              userData.savedPosts.map((item) => (
                <Card
                  item={{ ...item, user, image: item.images[0] }}
                  key={item.id}
                />
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="hidden h-full lg:block lg:w-2/5 lg:bg-orange-50">
        <Chat />
      </div>
    </div>
  );
}

export default Profile;
