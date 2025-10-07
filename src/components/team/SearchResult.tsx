import { addUserToProject } from "@/api/TeamAPI";
import { TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


type SearchResultProps = {
  user: TeamMember,
  reset: () => void
}

export default function SearchResult({ user, reset }: SearchResultProps) {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const MySwal = withReactContent(Swal);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({queryKey: ["projectTeam", projectId]});
      reset();

      MySwal.fire({
        title: "Agregar colaborador",
        html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Deseas agregar otro colaborador?
                    </p>
                  `,
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "No, agregar!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, agregar!",
      }).then((result) => {
        if (result.isDismissed) {
          navigate(location.pathname, { replace: true });
        }
      });
    }
  })

  const handleAddUserToProject = () => {
    const data = {
      projectId,
      id: user._id
    }
    mutate(data);
  }

  return (
    <>
      <div className="flex items-center justify-center flex-col w-full">
        <p className="mt-2 text-center font-bold">Resultado:</p>
        <div className="flex items-center justify-center flex-col space-y-2 w-full">
          <p className="text-gray-700">Usuario: <span className="text-black font-bold">{user.name}</span></p>
          <button
            onClick={handleAddUserToProject}
            type="button"
            className="flex items-center justify-center gap-x-4 border border-gray-400 py-1 px-2 rounded-md bg-gray-200/50 hover:bg-gray-200/75 transition-all duration-150 w-full md:w-auto uppercase font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
            Agregar al proyecto
          </button>
        </div>
      </div>
    </>
  )
}