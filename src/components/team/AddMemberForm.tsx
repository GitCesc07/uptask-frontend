import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import type { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamAPI";
import Loaders from "../Loaders";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
  const initialValues: TeamMemberForm = {
    email: "",
  };
  const params = useParams();
  const projectId = params.projectId!;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: findUserByEmail
  });

  const handleSearchUser = async (formData: TeamMemberForm) => {
    const data = { projectId, formData }
    mutation.mutate(data);
  };

  const resetData = () => {
    reset();
    mutation.reset();
  }

  return (
    <>
      <form
        className="mt-10 space-y-5"
        onSubmit={handleSubmit(handleSearchUser)}
        noValidate
      >
        <div className="flex flex-col gap-3">
          <label className="font-normal text-lg md:text-2xl" htmlFor="name">
            E-mail de Usuario
          </label>
          <input
            id="name"
            type="text"
            placeholder="E-mail del usuario a Agregar"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          className="bg-gray-800 hover:bg-gray-900 text-white w-full py-2 px-4 uppercase font-bold cursor-pointer transition-colors duration-200 rounded-md mt-8"
          value="Buscar Usuario"
        />
      </form>

      <div className="flex items-center justify-center mt-6">
        {mutation.isPending && (<Loaders />)}
        {
          mutation.isError &&
          (
            <p className="text-center text-red-500 uppercase">{mutation.error.message}</p>
          )
        }
        {mutation.data && (<SearchResult user={mutation.data} reset={resetData} />)}
      </div>
    </>
  );
}
