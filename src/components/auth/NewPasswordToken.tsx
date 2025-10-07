import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import type { ConfirmToken } from "@/types/index";
import { valiodateToken } from "@/api/AuthAPI";
import { toast } from "react-toastify";

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {
  
  const { mutate } = useMutation({
    mutationFn: valiodateToken,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      setIsValidToken(true)
    }
  })

  const handleChange = (token: ConfirmToken["token"])   => {
    setToken(token)
  };

  const handleComplete = (token: ConfirmToken["token"]) => mutate({ token  });

  return (
    <>
      <form className="space-y-8 p-10 bg-white mt-8 rounded-lg">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-4">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
          </PinInput>
        </div>
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/request-code"
          className="text-center text-cyan-600 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
