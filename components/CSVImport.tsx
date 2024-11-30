'use client'

import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, Download } from 'lucide-react';

interface Props {
  onImport: (data: any) => void;
  onClose: () => void;
}

const CSVImport: React.FC<Props> = ({ onImport, onClose }) => {
  const [previewData, setPreviewData] = useState<{headers: string[], rows: string[][]} | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Template structure
  const templateFields = [
    { key: 'state', label: 'State', example: 'IL' },
    { key: 'district', label: 'District', example: 'HD-48' },
    { key: 'dem_performance', label: 'Democratic Performance', example: '-12.5' },
    { key: 'voter_registration.current.dem', label: 'Democratic Registration', example: '35' },
    { key: 'voter_registration.current.rep', label: 'Republican Registration', example: '35' },
    { key: 'voter_registration.current.ind', label: 'Independent Registration', example: '30' },
    { key: 'fundraising.individual', label: 'Individual Contributions', example: '45000' },
    { key: 'fundraising.party', label: 'Party Contributions', example: '15000' },
    { key: 'fundraising.labor', label: 'Labor Contributions', example: '15000' },
    { key: 'fundraising.issueOrgs', label: 'Issue Org Contributions', example: '8000' },
    { key: 'fundraising.pac', label: 'PAC Contributions', example: '10000' }
  ];

  const downloadTemplate = () => {
    const headers = templateFields.map(field => field.label);
    const examples = templateFields.map(field => field.example);
    
    const csvContent = [
      headers.join(','),
      examples.join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'race_database_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1)
        .filter(line => line.trim())
        .map(line => line.split(',').map(cell => cell.trim()));

      setPreviewData({ headers, rows });
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!previewData) return;

    try {
      const { headers, rows } = previewData;
      const processedData = rows.map((row, rowIndex) => {
        const race = {
          id: Date.now() + rowIndex,
          voter_registration: { current: {} },
          fundraising: {},
          demographics: {}
        };

        headers.forEach((header, index) => {
          const field = templateFields.find(f => f.label === header);
          if (!field) return;

          const value = row[index];
          if (field.key.includes('.')) {
            const [parent, child, subChild] = field.key.split('.');
            if (subChild) {
              race[parent] = race[parent] || {};
              race[parent][child] = race[parent][child] || {};
              race[parent][child][subChild] = parseFloat(value) || 0;
            } else {
              race[parent] = race[parent] || {};
              race[parent][child] = parseFloat(value) || 0;
            }
          } else {
            race[field.key] = field.key === 'state' || field.key === 'district' ? 
              value : parseFloat(value) || 0;
          }
        });

        return race;
      });

      onImport(processedData);
      onClose();
    } catch (error) {
      setErrors(['Error processing file. Please check the format and try again.']);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Import Races from CSV</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          {!previewData ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                <p className="text-gray-500 mb-4">
                  Upload a CSV file containing race data, or download our template
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 border rounded-full flex items-center gap-2 hover:bg-gray-50"
                  >
                    <Download size={20} />
                    Download Template
                  </button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData.headers.map((header, index) => (
                        <th key={index} className="p-2 border text-left text-sm">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2 border text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-400 mr-2" size={20} />
                    <h3 className="text-red-800 font-medium">Import Errors</h3>
                  </div>
                  <ul className="mt-2 text-sm text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                >
                  <Check size={16} />
                  Import Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImport;