import React, { useState } from 'react';
import { Pencil, Trash2, X, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Race } from './RaceDatabase';
import RaceEditModal from './RaceEditModal';

interface RaceActionsProps {
  race: Race;
  onUpdate: (updatedRace: Race) => void;
  onDelete: (id: number) => void;
}

const RaceActions = ({ race, onUpdate, onDelete }: RaceActionsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (updatedRace: Race) => {
    try {
      const { data, error } = await supabase
        .from('races')
        .update(updatedRace)
        .eq('id', race.id)
        .select()
        .single();

      if (error) throw error;
      
      onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating race:', error);
      alert('Failed to update race. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('races')
        .delete()
        .eq('id', race.id);

      if (error) throw error;
      
      onDelete(race.id);
    } catch (error) {
      console.error('Error deleting race:', error);
      alert('Failed to delete race. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={handleDelete}
          className={`p-1 ${isDeleting ? 'text-red-600 hover:text-red-700' : 'text-gray-700 hover:text-gray-900'} hover:bg-gray-100 rounded`}
          title={isDeleting ? 'Click again to confirm' : 'Delete'}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isEditing && (
        <RaceEditModal
          race={race}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default RaceActions;