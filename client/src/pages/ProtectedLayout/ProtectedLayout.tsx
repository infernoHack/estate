import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../../redux/store";
import Chat from "../../components/Chat/Chat";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";

function ProtectedLayout() {
  const user = useAppSelector((state) => state.user.currentUser);

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative mx-auto max-h-full max-w-[1380px] px-10 md:px-12">
      <Modal>
        <Navbar />

        <main className="relative mt-28 min-h-[calc(100vh-112px)]">
          <Outlet />
        </main>

        <div className="lg:hidden">
          <Modal.Window name="chat-modal">
            <Chat />
          </Modal.Window>
        </div>
      </Modal>
    </div>
  );
}

export default ProtectedLayout;
