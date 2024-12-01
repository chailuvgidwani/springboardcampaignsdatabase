'use client'

import React, { useState, useEffect } from 'react';
import { Search, Eye, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { Race } from '@/types';
import { supabase } from '@/lib/supabase';
import CSVImport from './CSVImport';
import AuthComponent from './Auth';
import { Session } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react'
import RaceActions from './RaceActions';


// Add this after your Race interface but before the main RaceDatabase component
// Updated DistrictDetails component for RaceDatabase.tsx

// Updated DistrictDetails component for RaceDatabase.tsx

const DistrictDetails = ({ race, onClose }: { race: Race; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const chartColors = {
    demColor: '#0047AB', // Darker blue
    repColor: '#B22222', // Darker red
    indColor: '#2F4F4F', // Darker gray
    lineColor: '#1a365d', // Darker blue for trend lines
    tooltip: {
      bg: '#ffffff',
      border: '#e2e8f0',
      text: '#1a202c'
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number | undefined) => 
    amount ? `$${amount.toLocaleString()}` : 'N/A';

  // Helper function to format percentage
  const formatPercentage = (value: number | undefined) => 
    value !== undefined ? `${value}%` : 'N/A';

  const tabs = ['overview', 'registration', 'fundraising'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">{race.state} {race.district}</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-4">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 border-b-2 ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-700 font-medium' 
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Democratic Performance Trend</h3>
              <div className="h-64">
                {race.historical_results && race.historical_results.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={race.historical_results}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
                      <XAxis 
                        dataKey="year"
                        tick={{ fill: '#1a202c' }}
                        stroke="#475569"
                      />
                      <YAxis 
                        tick={{ fill: '#1a202c' }}
                        stroke="#475569"
                        tickFormatter={(value) => `${value}%`}
                      />

<Tooltip 
  contentStyle={{ 
    backgroundColor: chartColors.tooltip.bg,
    border: `1px solid ${chartColors.tooltip.border}`,
    color: chartColors.tooltip.text
  }}
  formatter={(value: number) => `${value}%`}
/>
                      <Line 
                        type="monotone" 
                        dataKey="result" 
                        stroke={chartColors.lineColor}
                        strokeWidth={2}
                        dot={{ fill: chartColors.lineColor }}
                        name="Dem Performance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-700">
                    No historical performance data available
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {race.historical_results?.sort((a, b) => b.year - a.year)?.map(result => (
                  <div key={result.year} className="p-3 border rounded bg-white">
                    <div className="text-sm font-medium text-gray-700">{result.year}</div>
                    <div className="font-medium text-gray-900">{formatPercentage(result.result)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'registration' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Voter Registration Trends</h3>
              <div className="h-64">
                {race.voter_registration?.trend && race.voter_registration.trend.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={race.voter_registration.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
                      <XAxis 
                        dataKey="year"
                        tick={{ fill: '#1a202c' }}
                        stroke="#475569"
                      />
                      <YAxis 
                        tick={{ fill: '#1a202c' }}
                        stroke="#475569"
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
  contentStyle={{ 
    backgroundColor: chartColors.tooltip.bg,
    border: `1px solid ${chartColors.tooltip.border}`,
    color: chartColors.tooltip.text
  }}
  formatter={(value: number) => `${value}%`}
/>
                      <Line 
                        type="monotone" 
                        dataKey="dem" 
                        stroke={chartColors.demColor} 
                        strokeWidth={2} 
                        name="Democratic" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rep" 
                        stroke={chartColors.repColor} 
                        strokeWidth={2} 
                        name="Republican" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ind" 
                        stroke={chartColors.indColor} 
                        strokeWidth={2} 
                        name="Independent" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-700">
                    No registration trend data available
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {race.voter_registration?.trend?.sort((a, b) => b.year - a.year)?.map(year => (
                  <div key={year.year} className="p-4 border rounded bg-white">
                    <h4 className="font-medium mb-2 text-gray-900">{year.year} Registration</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-blue-700">Democratic</div>
                        <div className="font-medium text-gray-900">{formatPercentage(year.dem)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-700">Republican</div>
                        <div className="font-medium text-gray-900">{formatPercentage(year.rep)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Independent</div>
                        <div className="font-medium text-gray-900">{formatPercentage(year.ind)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fundraising' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Fundraising History</h3>
              <div className="h-64">
                {race.fundraising?.historical && race.fundraising.historical.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={race.fundraising.historical}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
                      <XAxis 
                        dataKey="year"
                        tick={{ fill: '#1a202c' }}
                        stroke="#475569"
                      />
                      <YAxis 
                        tick={{ fill: '#1a202c' }}
                        stroke="#475569"
                        tickFormatter={(value) => `$${(value/1000).toLocaleString()}k`}
                      />
                      <Tooltip 
  contentStyle={{ 
    backgroundColor: chartColors.tooltip.bg,
    border: `1px solid ${chartColors.tooltip.border}`,
    color: chartColors.tooltip.text
  }}
  formatter={(value: number) => formatCurrency(value)}
/>
                      <Line type="monotone" dataKey="total" name="Total" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="labor" name="Labor" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="individual" name="Individual" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-700">
                    No fundraising history available
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {race.fundraising?.historical?.sort((a, b) => b.year - a.year)?.map(year => (
                  <div key={year.year} className="p-4 border rounded bg-white">
                    <h4 className="font-medium mb-2 text-gray-900">{year.year} Fundraising</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Individual</div>
                        <div className="font-medium text-gray-900">{formatCurrency(year.individual)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Labor</div>
                        <div className="font-medium text-gray-900">{formatCurrency(year.labor)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Party</div>
                        <div className="font-medium text-gray-900">{formatCurrency(year.party)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Issue Orgs</div>
                        <div className="font-medium text-gray-900">{formatCurrency(year.issueOrgs)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">PAC</div>
                        <div className="font-medium text-gray-900">{formatCurrency(year.pac)}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-sm font-medium text-gray-700">Total</div>
                        <div className="font-medium text-gray-900">{formatCurrency(year.total)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {race.notes && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Notes</h3>
              <p className="text-gray-700">{race.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RaceDatabase = () => {
  // Authentication state
  const [session, setSession] = useState<Session | null>(null);
  
  // Data and UI state
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Race>('state');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showImport, setShowImport] = useState(false);

  // Authentication effect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch races effect
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

  // Sorting helper
  const handleSort = (field: keyof Race) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Import handler
  const handleImport = async (importedRaces: Race[]) => {
    try {
      console.log('Attempting to insert data:', importedRaces);
      
      const { error } = await supabase
        .from('races')
        .insert(importedRaces)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Refresh the races list
      const { data: newData, error: fetchError } = await supabase
        .from('races')
        .select('*');
      
      if (fetchError) {
        console.error('Error fetching updated races:', fetchError);
        throw fetchError;
      }
      
      if (newData) {
        setRaces(newData);
      }
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const handleRaceUpdate = (updatedRace: Race) => {
    setRaces(races.map(race => 
      race.id === updatedRace.id ? updatedRace : race
    ));
  };
  
  const handleRaceDelete = (deletedId: number) => {
    setRaces(races.filter(race => race.id !== deletedId));
  };

  // Filtering and sorting logic
  // Replace the filteredRaces sorting section in RaceDatabase.tsx with this:

  // Helper function for safe nested property access
  // Helper function for safe nested property access
  type NestedObject = {
    [key: string]: string | number | boolean | NestedObject | undefined;
  };
  
  const getNestedValue = (obj: Race, path: string) => {
    const value = path.split('.').reduce((prev: unknown, curr: string) => {
      if (!prev || typeof prev !== 'object') return undefined;
      return (prev as NestedObject)[curr];
    }, obj as NestedObject);
    
    return typeof value === 'string' || typeof value === 'number' ? value : '';
  };

  // Filtering and sorting logic
  const filteredRaces = races
  .filter(race =>
    (race.state + race.district).toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aString = String(aValue || '');
    const bString = String(bValue || '');
    
    return sortDirection === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });

    // Auth check
  if (!session) {
    return <AuthComponent />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Race Database</h1>
        <button
          onClick={() => setShowImport(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2"
        >
          <Upload size={20} />
          Import CSV
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by state or district..."
          className="w-full pl-10 pr-4 py-2 border rounded text-gray-900 placeholder:text-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
        <thead>
  <tr className="bg-gray-100">
    <th className="p-2 border text-left">
      <button 
        className="flex items-center gap-1 text-gray-900 hover:text-black"
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
        className="flex items-center gap-1 text-gray-900 hover:text-black"
        onClick={() => handleSort('dem_performance')}
      >
        Performance
        {sortField === 'dem_performance' && (
          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </button>
    </th>
    <th className="p-2 border text-left">
      <button 
        className="flex items-center gap-1 text-gray-900 hover:text-black"
        onClick={() => handleSort('voter_registration.current.dem')}
      >
        Dem Reg %
        {sortField === 'voter_registration.current.dem' && (
          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </button>
    </th>
    <th className="p-2 border text-left">
      <button 
        className="flex items-center gap-1 text-gray-900 hover:text-black"
        onClick={() => handleSort('fundraising.labor')}
      >
        Labor $
        {sortField === 'fundraising.labor' && (
          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </button>
    </th>
    <th className="p-2 border text-left">
      <button 
        className="flex items-center gap-1 text-gray-900 hover:text-black"
        onClick={() => handleSort('fundraising.total')}
      >
        Total $
        {sortField === 'fundraising.total' && (
          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </button>
    </th>
    <th className="p-2 border text-center">Details</th>
    <th className="p-2 border text-center">Actions</th>
  </tr>
</thead>
          <tbody>
            {filteredRaces.map((race) => (
              <tr key={race.id} className="hover:bg-gray-50">
              <td className="p-2 border text-gray-900">{race.state} {race.district}</td>
              <td className="p-2 border text-gray-900">{race.dem_performance}%</td>
              <td className="p-2 border text-gray-900">{race.voter_registration.current.dem}%</td>
              <td className="p-2 border text-gray-900">${race.fundraising.labor.toLocaleString()}</td>
              <td className="p-2 border text-gray-900">${race.fundraising.total.toLocaleString()}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => setSelectedRace(race)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                    title="View Details"
                  >
                  <Eye size={16} className="text-gray-700" />                  </button>
                </td>
                <td className="p-2 border text-center">
                  <RaceActions
                    race={race}
                    onUpdate={handleRaceUpdate}
                    onDelete={handleRaceDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Import Modal */}
      {showImport && (
        <CSVImport
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Details Modal */}
      {selectedRace && (
        <DistrictDetails
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </div>
  );
};

export default RaceDatabase;