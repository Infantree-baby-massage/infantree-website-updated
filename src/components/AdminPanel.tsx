/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lock, FileSpreadsheet, Search, RefreshCw, Layers, Calendar, CheckSquare, Sparkles, Filter, X } from 'lucide-react';
import { Lead, Booking, TrialRequest } from '../types';
import { NAVI_MUMBAI_AREAS } from '../data';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'bookings' | 'trials'>('leads');
  
  // Db lists
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trials, setTrials] = useState<TrialRequest[]>([]);
  
  // Search and filter parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setErrorText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        fetchRecords();
      } else {
        setErrorText(data.error || 'Incorrect Admin passcode. Please try again.');
      }
    } catch (err) {
      setErrorText('Connection error authenticating admin. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecords = async () => {
    setErrorText('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLeads(data.leads || []);
        setBookings(data.bookings || []);
        setTrials(data.trials || []);
      } else {
        setErrorText(data.error || 'Failed to retrieve database records.');
      }
    } catch (err) {
      setErrorText('Database connection failed. Please ensure Firebase is active.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    let dataToExport: any[] = [];
    let filename = '';

    if (activeTab === 'leads') {
      dataToExport = filteredLeads;
      filename = 'infantree-leads-export.csv';
    } else if (activeTab === 'bookings') {
      dataToExport = filteredBookings;
      filename = 'infantree-bookings-export.csv';
    } else {
      dataToExport = filteredTrials;
      filename = 'infantree-trials-export.csv';
    }

    if (dataToExport.length === 0) {
      alert('No records available to export for this filter configuration.');
      return;
    }

    const headers = Object.keys(dataToExport[0]).filter(k => k !== 'id').join(',');
    const rows = dataToExport.map(item => {
      return Object.keys(dataToExport[0])
        .filter(k => k !== 'id')
        .map(key => {
          const val = item[key];
          let formattedValue = val === null || val === undefined ? '' : String(val);
          formattedValue = formattedValue.replace(/"/g, '""');
          if (formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n')) {
            formattedValue = `"${formattedValue}"`;
          }
          return formattedValue;
        }).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search computation logs
  const matchesSearchAndFilter = (item: any) => {
    const phoneStr = (item.phone || '').toLowerCase();
    const nameStr = (item.name || '').toLowerCase();
    const locStr = (item.location || '').toLowerCase();
    const searchLow = searchQuery.toLowerCase();

    const matchesSearch = !searchQuery || phoneStr.includes(searchLow) || nameStr.includes(searchLow);
    const matchesFilter = !areaFilter || locStr.includes(areaFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  };

  const filteredLeads = leads.filter(matchesSearchAndFilter);
  const filteredBookings = bookings.filter(matchesSearchAndFilter);
  const filteredTrials = trials.filter(matchesSearchAndFilter);

  // Derive unique location strings in DB lists for quick drop down filters
  const uniqueAreas = Array.from(new Set([
    ...leads.map(l => l.location),
    ...bookings.map(b => b.location),
    ...trials.map(t => t.location)
  ])).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" id="admin-panel-overlay">
      <div 
        className="bg-stone-50 w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 h-[88vh] flex flex-col overflow-hidden animate-scale-up"
        id="admin-dashboard-container"
      >
        {/* Head Bar */}
        <div className="bg-stone-950 px-6 py-4.5 text-white flex items-center justify-between" id="admin-panel-titlebar">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-display text-base font-semibold tracking-wider">Infantree Core Administration</span>
            <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-900/80 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800/40">Secure</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-white hover:bg-stone-800 p-1.5 rounded-full transition-all cursor-pointer"
            id="close-admin-panel-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access login Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50" id="admin-login-screen">
            <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-md text-stone-800 h-fit" id="admin-login-card">
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-display text-lg tracking-tight font-semibold">Administrator Login</h4>
                <p className="text-xs text-stone-500">
                  Enter the secure passcode configured in your environment to unlock the database leads.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4" id="login-form">
                <div>
                  <label htmlFor="admin-passcode" className="block text-xs font-semibold text-stone-600 mb-1">Passcode</label>
                  <input
                    type="password"
                    id="admin-passcode"
                    required
                    placeholder="Enter security key"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-sm bg-stone-50 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all text-stone-800"
                  />
                  <div className="mt-2 text-[10px] text-stone-400 font-sans">
                    Default key for inspection: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-700 select-all">infantree-luxury-admin-2026</code>
                  </div>
                </div>

                {errorText && (
                  <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200" id="login-error">
                    {errorText}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-stone-900 hover:bg-black text-white text-sm py-2.5 rounded-lg transition-all font-medium disabled:opacity-60 cursor-pointer text-center"
                  id="admin-authenticate-btn"
                >
                  {isLoading ? 'Accessing Data...' : 'Verify Authenticity'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Dashboard Interface */
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-stone-100" id="admin-main-dashboard">
            {/* Control Strip & KPI Cards */}
            <div className="p-4 bg-white border-b border-stone-200 grid grid-cols-1 md:grid-cols-4 gap-4" id="admin-control-strip">
              {/* KPIs */}
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-stone-800 flex items-center justify-between col-span-1" id="kpi-leads">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Total Leads</span>
                  <div className="text-xl font-display font-bold text-emerald-950 mt-0.5">{leads.length}</div>
                </div>
                <div className="bg-emerald-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold">L</div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl text-stone-800 flex items-center justify-between col-span-1" id="kpi-bookings">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Program Bookings</span>
                  <div className="text-xl font-display font-bold text-blue-950 mt-0.5">{bookings.length}</div>
                </div>
                <div className="bg-blue-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold">B</div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-stone-800 flex items-center justify-between col-span-1" id="kpi-trials">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Trial Visits</span>
                  <div className="text-xl font-display font-bold text-amber-950 mt-0.5">{trials.length}</div>
                </div>
                <div className="bg-amber-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold">T</div>
              </div>

              {/* Utility controls group */}
              <div className="flex items-center justify-end gap-2 col-span-1" id="admin-control-utilities">
                <button
                  type="button"
                  onClick={fetchRecords}
                  disabled={isLoading}
                  className="p-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 transition-all flex items-center justify-center text-xs gap-1 cursor-pointer font-medium"
                  id="admin-sync-btn"
                  title="Synchronize Database Records"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="p-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer shadow-sm"
                  id="admin-export-csv-btn"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export {activeTab.toUpperCase()} CSV
                </button>
              </div>
            </div>

            {/* Filter Group */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row gap-3 text-stone-800" id="filter-bar">
              {/* Tabs */}
              <div className="flex bg-stone-200 p-1 rounded-xl w-fit" id="dashboard-model-tabs">
                {(['leads', 'bookings', 'trials'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      activeTab === tab
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                    id={`tab-btn-${tab}`}
                  >
                    {tab === 'leads' ? 'Inquiry Leads' : tab === 'bookings' ? 'Care Bookings' : 'Trial Requests'}
                  </button>
                ))}
              </div>

              {/* Filter components */}
              <div className="flex-1 flex flex-col sm:flex-row gap-2 shrink" id="search-filter-controls">
                <div className="relative flex-1 min-w-[140px] max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by name / phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-all text-stone-800"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <select
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="border border-stone-300 bg-white px-2 py-2 rounded-lg text-xs focus:outline-none text-stone-800 max-w-[150px] truncate"
                  >
                    <option value="">All Locations</option>
                    {NAVI_MUMBAI_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                    {uniqueAreas.filter(a => !NAVI_MUMBAI_AREAS.includes(a)).map((a, idx) => (
                      <option key={idx} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid Table */}
            <div className="flex-1 overflow-auto min-h-0 p-4" id="table-display-section">
              {isLoading && (
                <div className="h-40 flex flex-col items-center justify-center text-stone-500 text-xs gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Loading database synchronizations...
                </div>
              )}

              {!isLoading && activeTab === 'leads' && (
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm" id="leads-grid-container">
                  <table className="w-full text-left text-xs text-stone-600 border-collapse">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-800 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Mother Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Geo Area</th>
                        <th className="p-3">Service Interest</th>
                        <th className="p-3">Inquiry / Note</th>
                        <th className="p-3">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-stone-400">No leads match search criteria.</td>
                        </tr>
                      ) : (
                        filteredLeads.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-stone-50/50">
                            <td className="p-3 font-semibold text-stone-900">{item.name}</td>
                            <td className="p-3 font-mono text-stone-800">{item.phone}</td>
                            <td className="p-3">{item.email || '-'}</td>
                            <td className="p-3"><span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium border border-emerald-100">{item.location}</span></td>
                            <td className="p-3 text-stone-850 font-medium">{item.serviceInterest || '-'}</td>
                            <td className="p-3 max-w-[200px] truncate" title={item.message}>{item.message || '-'}</td>
                            <td className="p-3 text-stone-400 font-mono text-[10px]">{item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {!isLoading && activeTab === 'bookings' && (
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm" id="bookings-grid-container">
                  <table className="w-full text-left text-xs text-stone-600 border-collapse">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-800 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Mother Name</th>
                        <th className="p-3">Phone Number</th>
                        <th className="p-3">Location Area</th>
                        <th className="p-3">Reserved Plan</th>
                        <th className="p-3">Requests / Notes</th>
                        <th className="p-3">Booking Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-stone-400">No subscription reservations stored.</td>
                        </tr>
                      ) : (
                        filteredBookings.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-stone-50/50">
                            <td className="p-3 font-semibold text-stone-900">{item.name}</td>
                            <td className="p-3 font-mono text-stone-800">{item.phone}</td>
                            <td className="p-3"><span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-medium border border-blue-100">{item.location}</span></td>
                            <td className="p-3 text-stone-850 font-semibold text-emerald-950">{item.selectedPlan}</td>
                            <td className="p-3 max-w-[200px] truncate" title={item.notes}>{item.notes || '-'}</td>
                            <td className="p-3 text-stone-400 font-mono text-[10px]">{item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {!isLoading && activeTab === 'trials' && (
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm" id="trials-grid-container">
                  <table className="w-full text-left text-xs text-stone-600 border-collapse">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-800 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Parent Name</th>
                        <th className="p-3">Phone Number</th>
                        <th className="p-3 font-medium">Service Area</th>
                        <th className="p-3">Health Notes / Due Date</th>
                        <th className="p-3">Trial Request Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150">
                      {filteredTrials.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-stone-400">No trial requests logged.</td>
                        </tr>
                      ) : (
                        filteredTrials.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-stone-50/50">
                            <td className="p-3 font-semibold text-stone-900">{item.name}</td>
                            <td className="p-3 font-mono text-stone-850">{item.phone}</td>
                            <td className="p-3"><span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium border border-amber-100">{item.location}</span></td>
                            <td className="p-3 max-w-[200px] truncate" title={item.notes}>{item.notes || '-'}</td>
                            <td className="p-3 text-stone-400 font-mono text-[10px]">{item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Footer lock indicator */}
            <div className="flex items-center gap-1 justify-center py-2 border-t border-stone-200 text-[10px] text-stone-400 font-mono">
              Verified User Email: {localStorage.getItem('admin_email_user') || 'Mohdaslamshah987@gmail.com'} | Connection Secure • Spark Firestore 2026
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
