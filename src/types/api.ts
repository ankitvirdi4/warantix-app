export interface User {
  id?: number;
  email: string;
  name?: string;
  role?: string;
}

export interface Claim {
  id?: number;
  claim_id: string;
  vin?: string;
  model: string;
  model_year?: number;
  region?: string;
  mileage_km?: number;
  failure_date?: string;
  component?: string;
  part_number?: string;
  dtc_codes?: string;
  symptom_text?: string;
  repair_action?: string;
  claim_cost_usd?: number;
  dealer_id?: string;
  latitude?: number;
  longitude?: number;
  cluster_id?: number | null;
}

export interface ClaimsResponse {
  items: Claim[];
  total: number;
  page: number;
  page_size: number;
}

export interface Cluster {
  id: number;
  label: string;
  num_claims: number;
  total_cost_usd: number;
  root_cause_hypothesis?: string | null;
  recommended_actions?: string | null;
  first_failure_date?: string | null;
  last_failure_date?: string | null;
  sample_dtc_codes?: string | null;
  sample_components?: string | null;
}

export interface TopFailureCluster {
  cluster_id: number;
  label: string;
  num_claims: number;
  total_cost_usd: number;
}

export interface TopFailuresResponse {
  clusters: TopFailureCluster[];
}

export interface CostByComponent {
  component: string;
  total_cost_usd: number;
  claim_count: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}
