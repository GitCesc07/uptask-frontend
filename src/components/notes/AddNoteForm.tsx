import { NoteFormData } from "@/types/index";
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteAPI";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

export default function AddNoteForm() {
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = params.projectId!
    const taskId = queryParams.get("viewTask")!

    const initialvalue: NoteFormData = { content: "" };
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialvalue });
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
            queryClient.invalidateQueries({ queryKey: ["task", taskId]});
        }
    })

    const handleSubmitForm = (formData: NoteFormData) => {
        mutate({ projectId, taskId, formData });
    }

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="space-y-3"
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="content">Crear notas</label>
                <input
                    type="text"
                    id="content"
                    placeholder="Contenido de la nota..."
                    className="w-full py-2 px-4 outline-none border border-gray-300 rounded-sm"
                    {...register("content", {
                        required: "El contenido es requerido"
                    })}
                />
                {
                    errors.content &&
                    (<ErrorMessage>{errors.content.message}</ErrorMessage>)
                }
            </div>

            <input
                type="submit"
                value="Crear nota"
                className="bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-all duration-150 w-full py-2 px-4 font-black cursor-pointer"
            />
        </form>
    )
}