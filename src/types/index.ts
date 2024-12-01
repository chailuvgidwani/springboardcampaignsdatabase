// src/types/index.ts

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
    id: number;
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
  
  // Component prop types
  export interface RaceActionsProps {
    race: Race;
    onUpdate: (updatedRace: Race) => void;
    onDelete: (id: number) => void;
  }
  
  export interface RaceEditModalProps {
    race: Race;
    onSave: (updatedRace: Race) => void;
    onClose: () => void;
  }
  
  export interface CSVImportProps {
    onImport: (data: Race[]) => Promise<void>;
    onClose: () => void;
  }
  
  export interface DistrictDetailsProps {
    race: Race;
    onClose: () => void;
  }
  
  // API response types
  export interface SupabaseResponse<T> {
    data: T | null;
    error: Error | null;
  }
  
  // Error handling types
  export interface AppError extends Error {
    code?: string;
    details?: string;
    hint?: string;
  }