import { ProjectRepository } from './project.repository';
import { CreateProjectInput, UpdateProjectInput } from '@project-pilot/validation';

const projectRepository = new ProjectRepository();

export class ProjectService {
  async createProject(data: CreateProjectInput) {
    return projectRepository.create(data);
  }

  async getProject(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  async listOrganizationProjects(organizationId: string) {
    return projectRepository.listByOrganization(organizationId);
  }

  async updateProject(id: string, data: UpdateProjectInput) {
    return projectRepository.update(id, data);
  }

  async deleteProject(id: string) {
    return projectRepository.delete(id);
  }
}
