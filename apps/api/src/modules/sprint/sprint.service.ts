import { SprintRepository } from './sprint.repository';
import { CreateSprintInput, UpdateSprintInput } from '@project-pilot/validation';

const sprintRepository = new SprintRepository();

export class SprintService {
  async createSprint(data: CreateSprintInput) {
    return sprintRepository.create(data);
  }

  async getSprint(id: string) {
    return sprintRepository.findById(id);
  }

  async listProjectSprints(projectId: string) {
    return sprintRepository.listByProject(projectId);
  }

  async updateSprint(id: string, data: UpdateSprintInput) {
    return sprintRepository.update(id, data);
  }

  async deleteSprint(id: string) {
    return sprintRepository.delete(id);
  }

  async startSprint(id: string) {
    // In a real app, you might want to deactivate other sprints in the same project
    return sprintRepository.toggleActive(id, true);
  }

  async completeSprint(id: string) {
    return sprintRepository.toggleActive(id, false);
  }
}
