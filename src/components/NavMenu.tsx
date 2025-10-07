import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


type NavMenuProps = {
  name: User["name"]
}

export default function NavMenu({name}: NavMenuProps){

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const logout = () => {

    MySwal.fire({
      title: "Cerrar sesión",
      html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas cerrar sesión?
                    </p>
                  `,
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, cerrar sesión!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, cerrar sesión!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authTokenUpTask");
        queryClient.removeQueries({ queryKey: ["user"] });
        navigate("/auth/login")
      }
    }); 
  }

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-cyan-700">
        <Bars3Icon className="w-8 h-8 text-white " />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-xl bg-gray-100/95 p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <p className="text-center text-lg text-black">
              Hola: <span className="text-gray-600 font-bold">{name}</span>
            </p>
            <Link to="/profile" className="block text-lg p-2 hover:text-cyan-700">
              Mi Perfil
            </Link>
            <Link to="/" className="block text-lg p-2 hover:text-cyan-700">
              Mis Proyectos
            </Link>
            <button
              className="block text-lg p-2 hover:text-cyan-700"
              type="button"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
