import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFullProjectDetails } from "@/api/ProjectAPI";
import Loaders from "@/components/Loaders";
import AddTaskModal from "@/components/tasks/AddModalTask";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager, isNotManager } from "@/utils/policies";
import { useMemo } from "react";

export default function ProjectDetailsView() {
  const { data: dataAuth, isLoading: isLoadingAuth } = useAuth();

  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getFullProjectDetails(projectId),
    retry: false,
  });

  const canEdit = useMemo(
    () => data?.manager === dataAuth?._id,
    [data, dataAuth]
  );
  if (isError) return <Navigate to="/404" />;
  if (data && dataAuth)
    return (
      <>
        <div
          className={`${
            isLoading && "flex items-center justify-center h-screen w-full"
          }`}
        >
          {isLoading && isLoadingAuth ? (
            <Loaders />
          ) : (
            <div>
              <h1 className="md:text-5xl text-3xl font-black">
                {data.projectName}
              </h1>
              <p className="md:text-2xl text-xl font-light text-gray-500 mt-5">
                {data.description}
              </p>

              {isManager(data.manager, dataAuth!._id) && (
                <nav className="my-5 fle gap-6 flex justify-between items-center md:flex-row flex-col">
                  <div className="flex md:flex-row flex-col items-center justify-center md:justify-start lg:justify-center gap-6 lg:gap-8 w-full lg:w-[50%]">
                    <button
                      className="bg-gray-800 hover:bg-gray-900 py-2 px-6 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full md:w-60 lg:w-auto"
                      onClick={() =>
                        navigate(location.pathname + "?newTask=true")
                      }
                    >
                      Agregar tarea
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                        className="stroke-white size-5"
                      >
                        <g
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M9.5 1.5H11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h1.5"></path>
                          <rect
                            width="5"
                            height="2.5"
                            x="4.5"
                            y=".5"
                            rx="1"
                          ></rect>
                          <path d="m4.5 8.5l2 1.5L9 6"></path>
                        </g>
                      </svg>
                    </button>

                    <Link
                      to={"team"}
                      className="bg-gray-800 hover:bg-gray-900 py-2 px-6 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full md:w-60 lg:w-auto"
                    >
                      Colaboradores
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                        className="fill-white size-7"
                      >
                        <path d="M244.8 150.4a8 8 0 0 1-11.2-1.6A51.6 51.6 0 0 0 192 128a8 8 0 0 1-7.37-4.89a8 8 0 0 1 0-6.22A8 8 0 0 1 192 112a24 24 0 1 0-23.24-30a8 8 0 1 1-15.5-4A40 40 0 1 1 219 117.51a67.94 67.94 0 0 1 27.43 21.68a8 8 0 0 1-1.63 11.21M190.92 212a8 8 0 1 1-13.84 8a57 57 0 0 0-98.16 0a8 8 0 1 1-13.84-8a72.06 72.06 0 0 1 33.74-29.92a48 48 0 1 1 58.36 0A72.06 72.06 0 0 1 190.92 212M128 176a32 32 0 1 0-32-32a32 32 0 0 0 32 32m-56-56a8 8 0 0 0-8-8a24 24 0 1 1 23.24-30a8 8 0 1 0 15.5-4A40 40 0 1 0 37 117.51a67.94 67.94 0 0 0-27.4 21.68a8 8 0 1 0 12.8 9.61A51.6 51.6 0 0 1 64 128a8 8 0 0 0 8-8"></path>
                      </svg>
                    </Link>
                  </div>

                  <Link
                    className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full md:w-80 lg:w-auto"
                    to="/"
                  >
                    Volver a proyectos
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="fill-white size-6"
                    >
                      <path d="m9 18l-6-6l6-6l1.4 1.4L6.8 11H19V7h2v6H6.8l3.6 3.6z"></path>
                    </svg>
                  </Link>
                </nav>
              )}

              {isNotManager(data.manager, dataAuth!._id) && (
                <div className="flex items-center justify-end">
                  <Link
                    className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full md:w-80 lg:w-auto"
                    to="/"
                  >
                    Volver a proyectos
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="fill-white size-6"
                    >
                      <path d="m9 18l-6-6l6-6l1.4 1.4L6.8 11H19V7h2v6H6.8l3.6 3.6z"></path>
                    </svg>
                  </Link>
                </div>
              )}

              <TaskList tasks={data.tasks} canEdit={canEdit} />
              <AddTaskModal />
              <EditTaskData />
              <TaskModalDetails />
            </div>
          )}
        </div>
      </>
    );
}
