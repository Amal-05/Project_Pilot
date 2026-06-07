import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../store/task.store';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id,
    },
  });

  return (
    <div className="flex flex-col w-80 bg-gray-100 rounded-xl p-4 min-h-[500px]">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-bold text-gray-700 flex items-center">
          {title}
          <span className="ml-2 bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <button 
          onClick={() => onAddTask?.(id)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
