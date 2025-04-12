import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/user.entity';
import { Role } from '../users/user.entity';
import { Task } from './tasks.entity';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(createDto: CreateTaskDto, user: User) {
    if (!user) {
      throw new ForbiddenException('Usuario no autorizado');
    }

    const task = this.taskRepo.create({ ...createDto, user });
    return this.taskRepo.save(task);
  }

  async findAll(user: User, filters: FilterTasksDto) {
    const { status, dueDate, page = 1, limit = 10 } = filters;
    const query = this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user');

    if (user.role !== Role.ADMIN) {
      query.andWhere('task.userId = :userId', { userId: user.id });
    }

    switch (true) {
      case status !== undefined:
        query.andWhere('task.status = :status', { status });
        break;

      case dueDate !== undefined:
        query.andWhere('task.dueDate = :dueDate', { dueDate });
        break;

      default:
        break;
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async findOne(id: number, user: User) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');

    if (user.role !== Role.ADMIN && task.user.id !== user.id) {
      throw new ForbiddenException('No tienes acceso a esta tarea');
    }

    return task;
  }

  async update(id: number, updateDto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);
    Object.assign(task, updateDto);
    return this.taskRepo.save(task);
  }

  async remove(id: number, user: User) {
    const task = await this.findOne(id, user);
    return this.taskRepo.remove(task);
  }
}
