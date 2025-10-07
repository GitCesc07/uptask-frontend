import api from "@/lib/axios";
import { Project, dashboardProjectSchema, ProjectFormData } from "@/types/index";
import { isAxiosError } from "axios";


// * Creando proyecto
export async function createProject(formData: ProjectFormData) {
   try {
     const { data } = await api.post("/projects", formData)
     return data
   } catch (error) {
    if(isAxiosError(error) && error.response) {
       throw new Error(error.response.data.error)
    }    
   }
}

// * Obteniendo todos los proyectos
export async function getProjects() {
  try {
    const {data} = await api("/projects")
    const response = dashboardProjectSchema.safeParse(data)
    if(response.success) {
      return response.data
    }    
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

// * Obteniendo un proyecto especifico según su id (Identificador unico)
export async function getProjectById(id: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${id}`);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

// * Editando proyecto
type ProjectAPIType = {
  formData: ProjectFormData,
  projectId: Project["_id"]
}
export async function updateProject({formData, projectId} : ProjectAPIType) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

// * Eliminando proyecto
export async function deleteProject(id: Project["_id"]) {
  try {
    const { data } = await api.delete<string>(`/projects/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}