import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Race } from '@/types';

interface RaceEditModalProps {
    race: Race;
    onSave: (updatedRace: Race) => void;
    onClose: () => void;
  }

const RaceEditModal = ({ race, onSave, onClose }: RaceEditModalProps) => {
  const [formData, setFormData] = useState({
    state: race.state,
    district: race.district,
    dem_performance: race.dem_performance,
    voter_registration: {
      current: {
        dem: race.voter_registration.current.dem,
        rep: race.voter_registration.current.rep,
        ind: race.voter_registration.current.ind
      }
    },
    fundraising: {
      individual: race.fundraising.individual,
      party: race.fundraising.party,
      labor: race.fundraising.labor,
      issueOrgs: race.fundraising.issueOrgs,
      pac: race.fundraising.pac
    },
    notes: race.notes || ''
  });

  const handleChange = (fieldPath: string, value: string | number) => {
    const numValue = fieldPath !== 'notes' ? parseFloat(value as string) || 0 : value;
    
    if (fieldPath.includes('.')) {
      const [section, subsection, field] = fieldPath.split('.') as [string, string, string];
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [field]: numValue
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldPath]: numValue
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total fundraising
    const totalFundraising = 
      formData.fundraising.individual +
      formData.fundraising.party +
      formData.fundraising.labor +
      formData.fundraising.issueOrgs +
      formData.fundraising.pac;

    // Preserve historical data while updating current values
    const updatedRace = {
      ...race,
      ...formData,
      fundraising: {
        ...formData.fundraising,
        total: totalFundraising,
        historical: race.fundraising.historical
      }
    };

    onSave(updatedRace);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit District Data</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Democratic Performance (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.dem_performance}
                onChange={(e) => handleChange('dem_performance', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          {/* Voter Registration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Voter Registration (%)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Democratic</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.voter_registration.current.dem}
                  onChange={(e) => handleChange('voter_registration.current.dem', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Republican</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.voter_registration.current.rep}
                  onChange={(e) => handleChange('voter_registration.current.rep', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Independent</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.voter_registration.current.ind}
                  onChange={(e) => handleChange('voter_registration.current.ind', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Fundraising */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Fundraising ($)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Individual</label>
                <input
                  type="number"
                  value={formData.fundraising.individual}
                  onChange={(e) => handleChange('fundraising.individual', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Party</label>
                <input
                  type="number"
                  value={formData.fundraising.party}
                  onChange={(e) => handleChange('fundraising.party', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Labor</label>
                <input
                  type="number"
                  value={formData.fundraising.labor}
                  onChange={(e) => handleChange('fundraising.labor', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Issue Orgs</label>
                <input
                  type="number"
                  value={formData.fundraising.issueOrgs}
                  onChange={(e) => handleChange('fundraising.issueOrgs', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">PAC</label>
                <input
                  type="number"
                  value={formData.fundraising.pac}
                  onChange={(e) => handleChange('fundraising.pac', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaceEditModal;