// Base types for voter registration data
export interface VoterRegistrationData {
  dem: number;
  rep: number;
  ind: number;
}

export interface RegistrationTrendPoint extends VoterRegistrationData {
  year: number;
}

// Fundraising types
export interface FundraisingData {
  individual: number;
  party: number;
  labor: number;
  issueOrgs: number;
  pac: number;
  total: number;
}

export interface FundraisingTrendPoint extends Omit<FundraisingData, 'total'> {
  year: number;
  total?: number;
}

// Main race interface
export interface Race {
  id?: number; // Made optional with ?
  state: string;
  district: string;
  dem_performance: number;
  voter_registration: {
    current: VoterRegistrationData;
    trend?: RegistrationTrendPoint[];
  };
  fundraising: FundraisingData & {
    historical?: FundraisingTrendPoint[];
  };
  historical_results?: Array<{
    year: number;
    result: number;
  }>;
  notes?: string;
}

// CSV import types
export interface CSVRow {
  state: string;
  district: string;
  [key: `${number}_performance`]: string;
  [key: `${number}_dem_reg`]: string;
  [key: `${number}_rep_reg`]: string;
  [key: `${number}_ind_reg`]: string;
  [key: `${number}_individual`]: string;
  [key: `${number}_party`]: string;
  [key: `${number}_labor`]: string;
  [key: `${number}_issueorgs`]: string;
  [key: `${number}_pac`]: string;
}

export interface CSVImportData {
  headers: string[];
  rows: string[][];
}