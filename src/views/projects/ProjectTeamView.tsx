import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { getTeamByProject, removeUserFromProject } from "@/api/TeamAPI";
import Loaders from "@/components/Loaders";
import AddMemberModal from "@/components/team/AddModalMember";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";



export default function ProjectTeamView() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId!

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getTeamByProject(projectId),
    retry: false
  });

  const { mutate } = useMutation({
    mutationFn: removeUserFromProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({queryKey: ["projectTeam", projectId]});
    }
  })

  if (isError) return <Navigate to={"/404"} />

  return (
    <>
      <h1 className="md:text-5xl text-3xl font-black">Administra Equipo</h1>
      <p className="md:text-2xl text-xl font-light text-gray-500 mt-5">
        Administra equipo de trabajo para este proyecto
      </p>

      <nav className="my-5 fle gap-6 flex justify-between items-center md:flex-row flex-col">
        <button
          className="bg-gray-800 hover:bg-gray-900 py-2 px-6 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full md:w-80 lg:w-auto"
          onClick={() => navigate(location.pathname + "?addMember=true")}
        >
          Agregar colaborador
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="fill-white size-7"
          >
            <path
              fillRule="evenodd"
              d="M6.75 7.5a4.25 4.25 0 1 1 8.5 0a4.25 4.25 0 0 1-8.5 0M11 4.75a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M3.25 17A3.75 3.75 0 0 1 7 13.25h.34q.28.001.544.086l.866.283a7.25 7.25 0 0 0 4.5 0l.866-.283c.175-.057.359-.086.543-.086H15A3.75 3.75 0 0 1 18.75 17v1.188c0 .754-.546 1.396-1.29 1.517a40.1 40.1 0 0 1-12.92 0a1.54 1.54 0 0 1-1.29-1.517zM7 14.75A2.25 2.25 0 0 0 4.75 17v1.188c0 .018.013.034.031.037c4.119.672 8.32.672 12.438 0a.04.04 0 0 0 .031-.037V17A2.25 2.25 0 0 0 15 14.75h-.34a.3.3 0 0 0-.079.012l-.865.283a8.75 8.75 0 0 1-5.432 0l-.866-.283a.3.3 0 0 0-.077-.012z"
              clipRule="evenodd"
            ></path>
            <path d="M19.5 6.25a.75.75 0 0 1 .75.75v1.75H22a.75.75 0 0 1 0 1.5h-1.75V12a.75.75 0 0 1-1.5 0v-1.75H17a.75.75 0 0 1 0-1.5h1.75V7a.75.75 0 0 1 .75-.75"></path>
          </svg>
        </button>

        <Link
          to={`/projects/${projectId}`}
          className="bg-gray-800 hover:bg-gray-900 py-2 px-6 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full md:w-60 lg:w-auto"
        >
          Volver a proyecto
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="fill-white size-6"
          >
            <path d="m9 18l-6-6l6-6l1.4 1.4L6.8 11H19V7h2v6H6.8l3.6 3.6z"></path>
          </svg>
        </Link>
      </nav>

      <div>
        {
          isLoading ?
            (
              <div className="flex items-center justify-center w-full">
                <Loaders />
              </div>
            )
            :
            <div>
              {
                data &&
                (
                  <>
                    <h2 className="text-5xl font-black my-4">Miembros actuales</h2>
                    {data.length ? (
                      <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-4 bg-white shadow-lg rounded-b-lg">
                        {data?.map((member) => (
                          <li key={member._id} className="flex justify-between gap-x-6 px-3 py-5">
                            <div className="flex min-w-0 gap-x-4">
                              <div className="min-w-0 flex-auto space-y-2">
                                <p className="text-2xl font-black text-gray-600">
                                  {member.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-6">
                              <Menu as="div" className="relative flex-none">
                                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                  <span className="sr-only">opciones</span>
                                  <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
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
                                      <button
                                        type='button'
                                        className='block px-3 py-1 text-sm leading-6 text-red-500'
                                        onClick={() => {
                                          MySwal.fire({
                                            title: "Eliminar colaborador",
                                            html: `
                                                        <p class="text-lg text-gray-600 text-center">
                                                          ¿Deseas eliminar colaborador?
                                                        </p>
                                                      `,
                                            icon: "question",
                                            showCancelButton: true,
                                            cancelButtonColor: "#d33",
                                            cancelButtonText: "No, eliminar!",
                                            confirmButtonColor: "#3085d6",
                                            confirmButtonText: "Si, eliminar!",
                                          }).then((result) => {
                                            if (result.isConfirmed) {
                                              mutate({ projectId, userId: member._id })
                                              refetch();
                                            }
                                          });
                                        }}
                                      >
                                        Eliminar del Proyecto
                                      </button>
                                    </Menu.Item>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <div className="flex items-center justify-center drop-shadow-md">
                          <img
                            className="size-52"
                            src="../../../lonely.svg"
                            alt="Lonely"
                          />
                        </div>
                        <p className='text-center py-4 text-xl'>
                          No hay miembros en este equipo...
                        </p>
                      </>
                    )}
                  </>
                )
              }
            </div>
        }
      </div>

      <AddMemberModal />
    </>
  );
}