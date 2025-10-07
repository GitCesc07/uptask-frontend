import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";
import Loaders from "@/components/Loaders";

export default function EditProjectView() {
    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
      queryKey: ["editProject", projectId],
      queryFn: ()=> getProjectById(projectId),
      retry: false
    });
        
    if(isError) return <Navigate to="/404" />
    if(data) return <EditProjectForm data={data} projectId={projectId} />
    return (
      <div className="flex items-center justify-center h-screen">
        {isLoading && <Loaders />}
      </div>
    );
}
