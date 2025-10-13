import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useAuth } from "@/hooks/useAuth";
import Loaders from "../Loaders";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/api/NoteAPI";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type NotesDetailsProps = {
  note: Note;
};

export default function NotesDetails({ note }: NotesDetailsProps) {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const projectId = params.projectId!;
  const taskId = queryParams.get("viewTask")!;

  const { data, isLoading } = useAuth();
  const canDelete = useMemo(
    () => data?._id === note.createdBy._id,
    [data, note]
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  return (
    <div className="p-2 flex justify-between items-center">
      {isLoading ? (
        <Loaders />
      ) : (
        <>
          <div>
            <p>
              {note.content} por:{" "}
              <span className="font-bold">{note.createdBy.name}</span>
            </p>

            <p className="text-xs text-slate-500">
              {formatDate(note.createdAt)}
            </p>
          </div>

          {canDelete && (
            <button
              type="button"
              className="bg-red-400 hover:bg-red-500 text-white font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors"
              onClick={() => {
                MySwal.fire({
                  title: "Eliminar nota",
                  html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas eliminar la nota?
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
                    mutate({ projectId, taskId, noteId: note._id });
                  }
                });
              }}
            >
              Eliminar
            </button>
          )}
        </>
      )}
    </div>
  );
}
