import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div className="bg-gray-800 min-h-screen">
        <div className="flex items-center justify-start pt-8 flex-col gap-8 p-4 mx-auto">
          <div className="w-80">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        position="bottom-center"
      />
    </>
  );
}
