import { Outlet } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Chat from "../../components/Chat/Chat";
import Modal from "../../components/Modal";

function AppLayout() {
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

export default AppLayout;
