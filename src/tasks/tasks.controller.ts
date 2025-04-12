import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('tasks') 
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' }) 
  @ApiBearerAuth() 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiBearerAuth() 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  findAll(@Query() filters, @Request() req) {
    return this.tasksService.findAll(req.user, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarea por id' })
  @ApiBearerAuth() 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.findOne(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una nueva tarea' })
  @ApiBearerAuth() 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una nueva tarea' }) 
  @ApiBearerAuth() 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.remove(id, req.user);
  }
}
