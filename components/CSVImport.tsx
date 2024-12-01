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
    // Basic identifiers
    { key: 'state', label: 'State', example: 'IL' },
    { key: 'district', label: 'District', example: 'HD-48' },
    
    // 2024 cycle
    { key: '2024_performance', label: '2024 Performance', example: '-12.5' },
    { key: '2024_dem_reg', label: '2024 Dem Registration', example: '35' },
    { key: '2024_rep_reg', label: '2024 Rep Registration', example: '35' },
    { key: '2024_ind_reg', label: '2024 Ind Registration', example: '30' },
    { key: '2024_individual', label: '2024 Individual $', example: '45000' },
    { key: '2024_party', label: '2024 Party $', example: '15000' },
    { key: '2024_labor', label: '2024 Labor $', example: '15000' },
    { key: '2024_issueorgs', label: '2024 Issue Org $', example: '8000' },
    { key: '2024_pac', label: '2024 PAC $', example: '10000' },
    
    // 2022 cycle
    { key: '2022_performance', label: '2022 Performance', example: '-14.8' },
    { key: '2022_dem_reg', label: '2022 Dem Registration', example: '33' },
    { key: '2022_rep_reg', label: '2022 Rep Registration', example: '37' },
    { key: '2022_ind_reg', label: '2022 Ind Registration', example: '30' },
    { key: '2022_individual', label: '2022 Individual $', example: '40000' },
    { key: '2022_party', label: '2022 Party $', example: '12000' },
    { key: '2022_labor', label: '2022 Labor $', example: '13000' },
    { key: '2022_issueorgs', label: '2022 Issue Org $', example: '7000' },
    { key: '2022_pac', label: '2022 PAC $', example: '9000' },
    
    // 2020 cycle
    { key: '2020_performance', label: '2020 Performance', example: '-16.3' },
    { key: '2020_dem_reg', label: '2020 Dem Registration', example: '32' },
    { key: '2020_rep_reg', label: '2020 Rep Registration', example: '38' },
    { key: '2020_ind_reg', label: '2020 Ind Registration', example: '30' },
    { key: '2020_individual', label: '2020 Individual $', example: '35000' },
    { key: '2020_party', label: '2020 Party $', example: '10000' },
    { key: '2020_labor', label: '2020 Labor $', example: '12000' },
    { key: '2020_issueorgs', label: '2020 Issue Org $', example: '6000' },
    { key: '2020_pac', label: '2020 PAC $', example: '8000' }
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
      const processedData = rows.map((row) => {
        // Create registration trend data
        const registrationTrend = [2020, 2022, 2024].map(year => ({
          year,
          dem: parseFloat(row[headers.findIndex(h => h === `${year} Dem Registration`)]) || 0,
          rep: parseFloat(row[headers.findIndex(h => h === `${year} Rep Registration`)]) || 0,
          ind: parseFloat(row[headers.findIndex(h => h === `${year} Ind Registration`)]) || 0
        }));
  
        // Create fundraising historical data
        const fundraisingHistory = [2020, 2022, 2024].map(year => ({
          year,
          individual: parseFloat(row[headers.findIndex(h => h === `${year} Individual $`)]) || 0,
          party: parseFloat(row[headers.findIndex(h => h === `${year} Party $`)]) || 0,
          labor: parseFloat(row[headers.findIndex(h => h === `${year} Labor $`)]) || 0,
          issueOrgs: parseFloat(row[headers.findIndex(h => h === `${year} Issue Org $`)]) || 0,
          pac: parseFloat(row[headers.findIndex(h => h === `${year} PAC $`)]) || 0
        }));
  
        // Calculate most recent totals for base fundraising object
        const currentFundraising = fundraisingHistory.find(f => f.year === 2024) || {
          individual: 0,
          party: 0,
          labor: 0,
          issueOrgs: 0,
          pac: 0
        };
  
        const race = {
          state: row[headers.findIndex(h => h === 'State')],
          district: row[headers.findIndex(h => h === 'District')],
          dem_performance: parseFloat(row[headers.findIndex(h => h === '2024 Performance')]) || 0,
          voter_registration: {
            current: {
              dem: parseFloat(row[headers.findIndex(h => h === '2024 Dem Registration')]) || 0,
              rep: parseFloat(row[headers.findIndex(h => h === '2024 Rep Registration')]) || 0,
              ind: parseFloat(row[headers.findIndex(h => h === '2024 Ind Registration')]) || 0
            },
            trend: registrationTrend
          },
          fundraising: {
            ...currentFundraising,
            total: Object.values(currentFundraising).reduce((a, b) => a + b, 0),
            historical: fundraisingHistory
          },
          historical_results: [2020, 2022, 2024].map(year => ({
            year,
            result: parseFloat(row[headers.findIndex(h => h === `${year} Performance`)]) || 0
          })),
          is_dem_trending: true, // You might want to calculate this based on performance trend
          notes: ''
        };
  
        return race;
      });
  
      console.log('Processed data:', processedData);
      onImport(processedData);
      onClose();
    } catch (error) {
      console.error('Error details:', error);
      setErrors(['Error processing file. Please check the format and try again.']);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Import Races from CSV</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!previewData ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload size={48} className="text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
                <p className="text-gray-700 mb-4">
                  Upload a CSV file containing race data, or download our template
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 border rounded-full flex items-center gap-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Download size={20} />
                    Download Template
                  </button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-gray-700
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-medium
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
                        <th key={index} className="p-2 border text-left text-sm font-medium text-gray-900">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2 border text-sm text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <h3 className="text-red-800 font-medium">Import Errors</h3>
                  </div>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
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