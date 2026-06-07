import { TaskRepository } from './task.repository';
import { CreateTaskInput, UpdateTaskInput, MoveTaskInput } from '@project-pilot/validation';

const taskRepository = new TaskRepository();

export class TaskService {
  async createTask(creatorId: string, data: CreateTaskInput) {
    return taskRepository.create({
      ...data,
      creatorId,
    });
  }

  async getTask(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async listProjectTasks(projectId: string) {
    return taskRepository.listByProject(projectId);
  }

  async updateTask(id: string, data: UpdateTaskInput) {
    return taskRepository.update(id, data);
  }

  async moveTask(id: string, data: MoveTaskInput) {
    return taskRepository.update(id, { status: data.status });
  }

  async deleteTask(id: string) {
    return taskRepository.delete(id);
  }
}
