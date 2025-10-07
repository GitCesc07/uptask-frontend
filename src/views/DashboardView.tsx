import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject, getProjects } from "@/api/ProjectAPI";
import Loaders from "@/components/Loaders";
import ProjectsEmpty from "@/components/ui-notfound/ProjectsEmpty";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";

const MySwal = withReactContent(Swal);

export default function DashboardView() {

  const { data: dataAuth, isLoading: isLoadingAuth } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  })

  return (
    <>
      <div className="sticky md:top-10 top-20 bg-white left-0 p-4">
        <h1 className="md:text-4xl text-3xl font-black">Mis proyectos</h1>
        <p className="md:text-xl text-lg font-light text-gray-500 mb-4">
          Maneja y administra tus proyectos
        </p>

        <div className="md:w-[30%] w-full">
          <Link
            className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
            to="/projects/create"
          >
            Nuevo proyecto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="fill-white size-6"
            >
              <path d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"></path>
            </svg>
          </Link>
        </div>
      </div>

      <div>
        {isLoading && isLoadingAuth ? (
          <div className="flex items-center md:my-40 my-16 justify-center">
            <Loaders />
          </div>
        ) : (
          <div>
            {data?.length ? (
              <ul
                role="list"
                className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg h-[40rem] overflow-y-scroll"
              >
                {data.map((project) => (
                  <li
                    key={project._id}
                    className="flex justify-between gap-x-6 px-5 py-10"
                  >
                    <div className="flex min-w-0 gap-x-4 ">
                      <div className="min-w-0 flex-auto space-y-2">
                        <div>
                          {
                            isManager(project.manager, dataAuth!._id) ?
                              (
                                <p
                                  className="font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg py-1 px-2 inline-block">
                                  Manager
                                </p>
                              )
                              :
                              (
                                <p
                                  className="font-bold text-xs uppercase bg-cyan-50 text-cyan-500 border-2 border-cyan-500 rounded-lg py-1 px-2 inline-block">
                                  Colaborador
                                </p>
                              )
                          }
                        </div>
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-gray-900 cursor-pointer hover:underline text-2xl md:text-3xl font-bold"
                        >
                          {project.projectName}
                        </Link>
                        <p className="text-sm text-gray-800 font-bold flex lg:flex-row flex-col  gap-1">
                          Cliente:
                          <span className="text-gray-600 font-normal">
                            {project.clientName}
                          </span>
                        </p>
                        <p className="text-sm text-gray-800 font-bold flex lg:flex-row flex-col  gap-1">
                          Descripción:
                          <span className="text-gray-600 font-normal">
                            {project.description}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-6">
                      <Menu as="div" className="relative flex-none">
                        <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                          <span className="sr-only">opciones</span>
                          <EllipsisVerticalIcon
                            className="h-9 w-9"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                              <Link
                                to={`/projects/${project._id}`}
                                className="block px-3 py-1 text-sm leading-6 text-gray-900"
                              >
                                Ver Proyecto
                              </Link>
                            </Menu.Item>
                            {
                              isManager(project.manager, dataAuth!._id)
                              &&
                              (
                                <>
                                  <Menu.Item>
                                    <Link
                                      to={`/projects/${project._id}/edit`}
                                      className="block px-3 py-1 text-sm leading-6 text-gray-900"
                                    >
                                      Editar Proyecto
                                    </Link>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <button
                                      type="button"
                                      className="block px-3 py-1 text-sm leading-6 text-red-500"
                                      onClick={() => {
                                        MySwal.fire({
                                          title: "Eliminar proyecto",
                                          html: `
                                      <p class="text-lg text-gray-600 text-center">
                                        ¿Seguro deseas eliminar el proyecto
                                        <span class="font-bold text-gray-900">${project.projectName}</span>?
                                      </p>
                                    `,
                                          text: "Si eliminas el proyecto no podras revertirlo",
                                          icon: "warning",
                                          showCancelButton: true,
                                          cancelButtonColor: "#d33",
                                          cancelButtonText: "No, eliminar!",
                                          confirmButtonColor: "#3085d6",
                                          confirmButtonText: "Si, eliminarlo!",
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            mutate(project._id);
                                          }
                                        });
                                      }}
                                    >
                                      Eliminar Proyecto
                                    </button>
                                  </Menu.Item>
                                </>
                              )
                            }
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ProjectsEmpty />
            )}
          </div>
        )}
      </div>
    </>
  );
}
