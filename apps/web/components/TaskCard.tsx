"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../store/task.store';
import { MoreVertical, Calendar, AlignLeft, CheckSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    LOW: 'bg-blue-100 text-blue-700',
    MEDIUM: 'bg-green-100 text-green-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <h4 className="text-sm font-semibold text-gray-800 mb-2 leading-tight">{task.title}</h4>
      
      <div className="flex items-center space-x-3 mt-4">
        {task.description && <AlignLeft className="w-3.5 h-3.5 text-gray-400" />}
        <div className="flex items-center text-gray-400 text-[11px]">
          <CheckSquare className="w-3.5 h-3.5 mr-1" />
          <span>0/0</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-gray-400 text-[11px]">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex -space-x-2">
          {task.assignee ? (
            <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
              {task.assignee.firstName?.[0]}{task.assignee.lastName?.[0]}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
