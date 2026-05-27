/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  serviceInterest?: string;
  message?: string;
  timestamp: string; // ISO string
  source: string; // 'Website' | 'WhatsApp' | 'Contact Form' | etc
}

export interface Booking {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  selectedPlan: string;
  notes?: string;
  timestamp: string; // ISO string
  source: string;
}

export interface TrialRequest {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  notes?: string;
  timestamp: string; // ISO string
  source: string;
}

export interface CareServicePlan {
  id: string;
  name: string;
  price: number;
  durationLabel: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface LongTermPlan {
  id: string;
  targetServiceId: 'baby' | 'mother';
  months: number;
  totalPrice: number;
  originalPrice: number;
  savingPercent: number;
  features: string[];
}
