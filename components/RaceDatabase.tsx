'use client'

import React, { useState, useEffect } from 'react';
import { Search, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Define our TypeScript interfaces
interface Race {
  id: number;
  state: string;
  district: string;
  dem_performance: number;
  voter_registration: {
    current: {
      dem: number;
      rep: number;
      ind: number;
    };
  };
  fundraising: {
    individual: number;
    party: number;
    labor: number;
    issueOrgs: number;
    pac: number;
    total: number;
  };
  demographics: {
    collegeEducation: number;
    medianIncome: number;
  };
  notes?: string;
}

const RaceDatabase = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Race>('state');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch races from Supabase
  useEffect(() => {
    const fetchRaces = async () => {
      const { data, error } = await supabase
        .from('races')
        .select('*');

      if (error) {
        console.error('Error fetching races:', error);
        return;
      }

      if (data) {
        setRaces(data);
      }
    };

    fetchRaces();
  }, []);

  const handleSort = (field: keyof Race) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredRaces = races
    .filter(race =>
      (race.state + race.district).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (bValue > aValue ? 1 : -1);
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Race Database</h1>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by state or district..."
          className="w-full pl-10 pr-4 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('state')}
                >
                  State/District
                  {sortField === 'state' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="p-2 border text-left">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('dem_performance')}
                >
                  Performance
                  {sortField === 'dem_performance' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRaces.map((race) => (
              <tr key={race.id} className="hover:bg-gray-50">
                <td className="p-2 border">{race.state} {race.district}</td>
                <td className="p-2 border">{race.dem_performance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RaceDatabase;