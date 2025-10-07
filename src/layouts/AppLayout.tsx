import {Link, Navigate, Outlet} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import Loaders from "@/components/Loaders";

export default function AppLayout() {

  const {data, isError, isLoading} = useAuth()

  if (isError) {
    return <Navigate to="/auth/login" />
  }

  if(data) return (
    <>
      <header className="bg-gray-800 py-5 top-0 sticky z-[1]">
        <div className="sticky top-0 right-0 max-w-screen-lg mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="w-64">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <NavMenu
            name={data.name}
          />
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center md:my-40 my-16 justify-center">
          <Loaders />
        </div>
      ) : (
        <section className="max-w-screen-xl mx-auto mt-2 md:mt-4 lg:mt-6 p-4 lg:p-8">
          <Outlet />
        </section>
      )}

      <footer className="py-5">
        <p className="text-center font-bold">
          Todos los derechos reservados{" "}
          <span className="text-gray-900">{new Date().getFullYear()}</span>
        </p>
      </footer>

      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        position="bottom-center"
      />
    </>
  );
}
