function UpdateProfile() {
  const user = null;

  return (
    <div>
      <form>
        {/* <ul className="flex flex-col justify-between gap-4">
          <li className="flex items-center">
            <span className="w-1/3 md:w-1/6">Avatar:</span>
            <img
              src={user?.avatar || "/noavatar.jpg"}
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
        </ul> */}
      </form>
      <div></div>
    </div>
  );
}

export default UpdateProfile;
