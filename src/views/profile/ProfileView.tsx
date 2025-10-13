import Loaders from "@/components/Loaders";
import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileView() {
  const { data, isLoading } = useAuth();

  if (data) return (
  <>
    {
        isLoading ? 
        (
            <Loaders />
        )
        :
        (
            <ProfileForm data={data} />
        )
    }
  </>
)
}
