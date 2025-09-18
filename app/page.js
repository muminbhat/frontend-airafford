"use client";
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "./config";

const stopsOptions = [
  { value: "any", label: "Any stops" },
  { value: "direct", label: "Direct only" },
  { value: "max1", label: "Max 1 stop" },
];

const cabinOptions = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First Class" },
];

// SVG Icons
const PlaneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Airline codes to names mapping
const AIRLINE_NAMES = {
  'AA': 'American Airlines',
  'DL': 'Delta Air Lines',
  'UA': 'United Airlines',
  'WN': 'Southwest Airlines',
  'B6': 'JetBlue Airways',
  'AS': 'Alaska Airlines',
  'F9': 'Frontier Airlines',
  'NK': 'Spirit Airlines',
  'G4': 'Allegiant Air',
  'SY': 'Sun Country Airlines',
  'AC': 'Air Canada',
  'WS': 'WestJet',
  'LH': 'Lufthansa',
  'BA': 'British Airways',
  'AF': 'Air France',
  'KL': 'KLM',
  'LX': 'Swiss International',
  'OS': 'Austrian Airlines',
  'SN': 'Brussels Airlines',
  'IB': 'Iberia',
  'AZ': 'ITA Airways',
  'EI': 'Aer Lingus',
  'SK': 'SAS',
  'AY': 'Finnair',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  'EY': 'Etihad Airways',
  'TK': 'Turkish Airlines',
  'SV': 'Saudi Arabian Airlines',
  'MS': 'EgyptAir',
  'NH': 'ANA',
  'JL': 'Japan Airlines',
  'CX': 'Cathay Pacific',
  'SQ': 'Singapore Airlines',
  'TG': 'Thai Airways',
  'MH': 'Malaysia Airlines',
  'CI': 'China Airlines',
  'BR': 'EVA Air',
  'KE': 'Korean Air',
  'OZ': 'Asiana Airlines',
  'JQ': 'Jetstar',
  'TR': 'Scoot',
  'AI': 'Air India',
  '6E': 'IndiGo',
  'SG': 'SpiceJet',
  'QF': 'Qantas',
  'VA': 'Virgin Australia',
  'NZ': 'Air New Zealand',
  'LA': 'LATAM Airlines',
  'AM': 'Aeromexico',
  'CM': 'Copa Airlines',
  'AV': 'Avianca',
  'SA': 'South African Airways',
  'ET': 'Ethiopian Airlines',
  'KQ': 'Kenya Airways',
  'AT': 'Royal Air Maroc',
};

function getAirlineName(code) {
  return AIRLINE_NAMES[code] || code;
}

function FlightDetailModal({ deal, isOpen, onClose }) {
  if (!isOpen || !deal) return null;

  const hours = Math.round((deal.duration_minutes || 0) / 60);
  const minutes = (deal.duration_minutes || 0) % 60;
  const pct = deal.price_pct_drop != null ? Math.round(deal.price_pct_drop * 100) : null;
  const airlineNames = (deal.airline_codes || []).map(code => getAirlineName(code));
  
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {deal.origin_iata} → {deal.destination_iata}
                </h2>
                <div className="text-blue-100">
                  Flight Details & Information
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <XIcon />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Flight Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <PlaneIcon />
                    Flight Information
                  </h3>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Route:</span>
                      <span className="font-bold text-slate-800">{deal.origin_iata} → {deal.destination_iata}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Trip Type:</span>
                      <span className="font-bold text-slate-800">{deal.one_way_bool ? "One way" : "Round trip"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Duration:</span>
                      <span className="font-bold text-slate-800">
                        {hours}h {minutes > 0 && `${minutes}m`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Stops:</span>
                      <span className="font-bold text-slate-800">
                        {deal.num_stops === 0 ? "Direct flight" : `${deal.num_stops} stop${deal.num_stops > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Cabin:</span>
                      <span className="font-bold text-slate-800 capitalize">
                        {(deal.cabin_class || 'Economy').replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Travelers:</span>
                      <span className="font-bold text-slate-800">{deal.num_travelers} passenger{deal.num_travelers > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Airlines */}
                {airlineNames.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      ✈️ Airlines
                    </h3>
                    <div className="space-y-2">
                      {airlineNames.map((airline, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <span className="font-semibold text-blue-800">{airline}</span>
                          <span className="text-blue-600 ml-2 text-sm">({deal.airline_codes[index]})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CalendarIcon />
                    Schedule
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="font-semibold text-slate-800 mb-2">Departure</div>
                      <div className="text-slate-600">{formatDateTime(deal.departure_datetime)}</div>
                    </div>
                    
                    {!deal.one_way_bool && deal.return_datetime && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="font-semibold text-slate-800 mb-2">Return</div>
                        <div className="text-slate-600">{formatDateTime(deal.return_datetime)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Booking */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">💰 Pricing Details</h3>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-slate-800 mb-2">
                        {deal.currency} {Number(deal.price_total).toFixed(0)}
                      </div>
                      <div className="text-slate-600">
                        Total for {deal.num_travelers} passenger{deal.num_travelers > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {deal.price_baseline && (
                      <div className="text-center mb-4">
                        <div className="text-slate-500 line-through text-lg">
                          {deal.currency} {Number(deal.price_baseline).toFixed(0)}
                        </div>
                        {pct && (
                          <div className="text-emerald-600 font-bold text-lg">
                            Save {pct}% 🎉
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-center text-sm text-slate-600">
                      Price per person: {deal.currency} {Math.round(Number(deal.price_total) / deal.num_travelers)}
                    </div>
                  </div>
                </div>

                {/* AI Score */}
                {deal.score_int_0_100 != null && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">🤖 AI Analysis</h3>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-slate-800">Deal Score</span>
                          <span className="text-2xl font-bold text-slate-800">{deal.score_int_0_100}/100</span>
                        </div>
                        <Score value={deal.score_int_0_100} />
                      </div>
                      
                      {(deal.score_factors_json || []).length > 0 && (
                        <div>
                          <div className="font-semibold text-slate-800 mb-2">Score Factors:</div>
                          <ul className="space-y-1">
                            {(deal.score_factors_json || []).map((factor, index) => (
                              <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Badges */}
                {(deal.badges_json || []).length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">🏷️ Deal Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {(deal.badges_json || []).map((badge, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 px-3 py-2 text-sm font-bold text-blue-800">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-slate-50 p-6">
            <div className="flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <a
                href={deal.deep_link || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <ExternalLinkIcon />
                Book This Flight
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children, required = false }) {
  return (
    <label className="block text-sm font-bold text-slate-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function Input({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
          <Icon />
        </div>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-3 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 
          ${Icon ? 'pl-10' : ''} 
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          } 
          focus:shadow-md ${props.className || ""}`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium animate-fade-in">{error}</p>
      )}
    </div>
  );
}

function Select({ icon: Icon, children, error, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 z-10">
          <Icon />
        </div>
      )}
      <select
        {...props}
        className={`w-full rounded-xl border bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition-all duration-200 appearance-none cursor-pointer
          ${Icon ? 'pl-10' : ''} 
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          } 
          focus:shadow-md ${props.className || ""}`}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium animate-fade-in">{error}</p>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-slate-400'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm font-bold text-slate-800">{label}</span>
    </div>
  );
}

function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-secondary text-foreground border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    primary: "bg-primary/10 text-primary border-primary/20",
  };
  
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${variants[variant]} mr-2 mb-2`}>
      {children}
    </span>
  );
}

function Score({ value }) {
  const getScoreColor = (score) => {
    if (score >= 85) return { bg: "bg-success", text: "text-success" };
    if (score >= 70) return { bg: "bg-emerald-500", text: "text-emerald-500" };
    if (score >= 50) return { bg: "bg-warning", text: "text-warning" };
    return { bg: "bg-error", text: "text-red-600 font-medium" };
  };
  
  const { bg, text } = getScoreColor(value);
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${bg}`} 
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <span className={`text-sm font-bold ${text}`}>{value}</span>
    </div>
  );
}

function DealCard({ deal, index, onViewDetails }) {
  const hours = Math.round((deal.duration_minutes || 0) / 60);
  const pct = deal.price_pct_drop != null ? Math.round(deal.price_pct_drop * 100) : null;
  const airlineNames = (deal.airline_codes || []).map(code => getAirlineName(code));
  
  return (
    <div 
      className="animate-fade-in group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
        
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-bold text-slate-800">
                {deal.origin_iata} → {deal.destination_iata}
              </div>
            </div>
            
            {/* Airline Names */}
            {airlineNames.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-bold text-blue-700">
                  ✈️ {airlineNames.slice(0, 2).join(" + ")}
                  {airlineNames.length > 2 && ` +${airlineNames.length - 2} more`}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
              <div className="flex items-center gap-2 bg-slate-200 rounded-full px-3 py-1">
                <div className="text-slate-600"><PlaneIcon /></div>
                <span className="font-semibold text-slate-700">{deal.one_way_bool ? "One way" : "Round trip"}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-200 rounded-full px-3 py-1">
                <div className="text-slate-600"><LocationIcon /></div>
                <span className="font-semibold text-slate-700">{deal.num_stops === 0 ? "Direct" : `${deal.num_stops} stops`}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-200 rounded-full px-3 py-1">
                <div className="text-slate-600"><ClockIcon /></div>
                <span className="font-semibold text-slate-700">{hours}h</span>
              </div>
            </div>
            
            {(deal.badges_json || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(deal.badges_json || []).map((badge, i) => (
                  <span key={i} className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 px-3 py-1 text-xs font-bold text-blue-800">
                    {badge}
                  </span>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onViewDetails(deal);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors duration-200"
              >
                <InfoIcon />
                <span>View Details</span>
              </button>
              <a
                href={deal.deep_link || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                <ExternalLinkIcon />
                <span>Book Now</span>
              </a>
            </div>
          </div>
          
          <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {deal.currency} {Number(deal.price_total).toFixed(0)}
            </div>
            
            {deal.price_baseline != null && (
              <div className="text-sm text-slate-600 mb-3">
                <span className="line-through font-medium">
                  {deal.currency} {Number(deal.price_baseline).toFixed(0)}
                </span>
                {pct != null && (
                  <div className="inline-flex items-center ml-2 bg-emerald-200 text-emerald-800 rounded-full px-2 py-1 text-xs font-bold">
                    🎉 {pct}% off
                  </div>
                )}
              </div>
            )}
            
            {deal.score_int_0_100 != null && (
              <div className="mt-4">
                <div className="text-xs text-slate-600 mb-2 font-bold">✨ AI Score</div>
                <Score value={deal.score_int_0_100} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSearchCard({ 
  origin, setOrigin, destination, setDestination, dep, setDep, 
  onSearch, loading, originHints, destHints, onClearOriginHints, onClearDestHints 
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 xl:p-8 shadow-2xl border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-xl xl:text-2xl font-bold text-slate-800 mb-2">Start Your Journey</h2>
        <p className="text-slate-600 text-sm xl:text-base">Search flights in seconds</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <label className="block text-sm font-bold text-slate-800 mb-1">From</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">
                <LocationIcon />
              </div>
              <input 
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Origin" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {originHints.length > 0 && (
                <div className="absolute z-30 mt-1 w-full rounded-xl border border-slate-300 bg-white shadow-xl max-h-40 overflow-auto animate-fade-in">
                  {originHints.map((airport) => (
                    <div
                      key={airport.iata}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-slate-100 last:border-b-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrigin(airport.iata);
                        onClearOriginHints();
                      }}
                    >
                      <div className="font-bold text-slate-800">{airport.iata}</div>
                      <div className="text-sm text-slate-600">{airport.city || airport.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <label className="block text-sm font-bold text-slate-800 mb-1">To</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">
                <LocationIcon />
              </div>
              <input 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Destination" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {destHints.length > 0 && (
                <div className="absolute z-30 mt-1 w-full rounded-xl border border-slate-300 bg-white shadow-xl max-h-40 overflow-auto animate-fade-in">
                  {destHints.map((airport) => (
                    <div
                      key={airport.iata}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-slate-100 last:border-b-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDestination(airport.iata);
                        onClearDestHints();
                      }}
                    >
                      <div className="font-bold text-slate-800">{airport.iata}</div>
                      <div className="text-sm text-slate-600">{airport.city || airport.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">Departure</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">
              <CalendarIcon />
            </div>
            <input 
              type="date"
              value={dep}
              onChange={(e) => setDep(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
        
        <button 
          onClick={onSearch}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? <SpinnerIcon /> : <SearchIcon />}
            {loading ? "Searching..." : "Search Flights"}
          </div>
        </button>
      </div>
    </div>
  );
}

function AirportSelector({ value, onChange, placeholder, hints, onHintSelect, onClearHints, label, required, error }) {
  return (
    <div 
      className="relative" 
      onClick={(e) => e.stopPropagation()}
    >
      <Label required={required}>{label}</Label>
      <Input
        icon={LocationIcon}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
        onClick={(e) => e.stopPropagation()}
      />
      {hints.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-card shadow-xl max-h-48 overflow-auto animate-fade-in">
          {hints.map((airport) => (
            <div
              key={airport.iata}
              className="px-4 py-3 hover:bg-secondary cursor-pointer transition-colors duration-150 border-b border-border last:border-b-0"
              onClick={(e) => {
                e.stopPropagation();
                onHintSelect(airport.iata);
                onClearHints();
              }}
            >
              <div className="font-semibold text-foreground">{airport.iata}</div>
              <div className="text-sm text-muted">{airport.city || airport.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function fetchAirports(q) {
  if (!q || q.length < 2) return [];
  try {
    const res = await fetch(`${API_BASE}/metadata/airports?query=${encodeURIComponent(q)}`);
    const data = await res.json();
    return data.airports || [];
  } catch (error) {
    console.error('Failed to fetch airports:', error);
    return [];
  }
}

export default function Home() {
  const [oneWay, setOneWay] = useState(true);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dep, setDep] = useState("");
  const [ret, setRet] = useState("");
  const [stops, setStops] = useState("any");
  const [travelers, setTravelers] = useState(1);
  const [cabin, setCabin] = useState("ECONOMY");
  const [loading, setLoading] = useState(false);
  const [deals, setDeals] = useState([]);
  const [error, setError] = useState("");
  const [originHints, setOriginHints] = useState([]);
  const [destHints, setDestHints] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => setOriginHints(await fetchAirports(origin)), 300);
    return () => clearTimeout(t);
  }, [origin]);

  useEffect(() => {
    const t = setTimeout(async () => setDestHints(await fetchAirports(destination)), 300);
    return () => clearTimeout(t);
  }, [destination]);

  // Close airport hints when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOriginHints([]);
      setDestHints([]);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!origin.trim()) {
      newErrors.origin = "Origin is required";
    }
    
    if (!dep) {
      newErrors.dep = "Departure date is required";
    }
    
    if (!oneWay && !ret) {
      newErrors.ret = "Return date is required for round trip";
    }
    
    if (travelers < 1 || travelers > 9) {
      newErrors.travelers = "Travelers must be between 1 and 9";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSearch() {
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    setErrors({});
    
    // Scroll to results section smoothly after a short delay to allow loading state to show
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
    
    try {
      const body = {
        oneWay,
        origin: origin.trim().toUpperCase(),
        destination: destination.trim() ? destination.trim().toUpperCase() : undefined,
        dateRange: { start: dep, end: ret },
        stops,
        travelers,
        cabin,
        limit: 25,
      };
      
      const res = await fetch(`${API_BASE}/deals/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Search request failed');
      }
      
      setDeals(data.deals || []);
    } catch (e) {
      setError(e.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleViewDetails = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDeal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="/airplane-hero.jpg" 
            alt="Airplane in sky" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-slate-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left animate-slide-in-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white drop-shadow-lg">
                  Find Your
                </span>
                <br />
                <span 
                  className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))',
                  }}
                >
                  Perfect Flight
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 max-w-xl mb-8 leading-relaxed drop-shadow-sm">
                Discover amazing flight deals with our AI-powered search engine. 
                <span className="text-cyan-200 font-semibold"> Smart recommendations</span>, 
                <span className="text-blue-200 font-semibold"> real-time prices</span>, and 
                <span className="text-emerald-200 font-semibold"> unbeatable savings</span> await.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-8">
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-white font-semibold text-sm sm:text-base drop-shadow-sm">AI-Powered Scoring</span>
                </div>
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-sm" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-white font-semibold text-sm sm:text-base drop-shadow-sm">Real-time Prices</span>
                </div>
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-sm" style={{animationDelay: '1s'}}></div>
                  <span className="text-white font-semibold text-sm sm:text-base drop-shadow-sm">Best Deal Alerts</span>
                </div>
              </div>
              
              <div className="text-lg">
                <span className="font-bold text-white drop-shadow-sm">Join 50,000+</span> 
                <span className="text-white/85 font-medium drop-shadow-sm"> travelers who save with AirAfford</span>
              </div>
            </div>
            
            {/* Right Content - Search Preview Card */}
            <div className="hidden lg:block animate-slide-in-right">
              <HeroSearchCard 
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
                dep={dep}
                setDep={setDep}
                onSearch={onSearch}
                loading={loading}
                originHints={originHints}
                destHints={destHints}
                onClearOriginHints={() => setOriginHints([])}
                onClearDestHints={() => setDestHints([])}
              />
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div id="results-section" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-16 -mt-16 relative z-20">
        {/* Search Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-16 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Advanced Search</h2>
              <p className="text-slate-600">Find your perfect flight with detailed options</p>
            </div>
            <Toggle 
              checked={!oneWay} 
              onChange={(v) => setOneWay(!v)} 
              label={oneWay ? "One way" : "Round trip"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-1">
              <AirportSelector
                label="From"
                required
                value={origin}
                onChange={setOrigin}
                placeholder="Origin airport (e.g., JFK)"
                hints={originHints}
                onHintSelect={setOrigin}
                onClearHints={() => setOriginHints([])}
                error={errors.origin}
              />
            </div>

            <div className="lg:col-span-1">
              <AirportSelector
                label="To"
                value={destination}
                onChange={setDestination}
                placeholder="Destination (or leave empty for anywhere)"
                hints={destHints}
                onHintSelect={setDestination}
                onClearHints={() => setDestHints([])}
                error={errors.destination}
              />
            </div>

            <div className="lg:col-span-1">
              <Label required>Departure</Label>
              <Input
                icon={CalendarIcon}
                type="date"
                value={dep}
                onChange={(e) => setDep(e.target.value)}
                onKeyPress={handleKeyPress}
                error={errors.dep}
              />
            </div>

            {!oneWay && (
              <div className="lg:col-span-1">
                <Label required>Return</Label>
                <Input
                  icon={CalendarIcon}
                  type="date"
                  value={ret}
                  onChange={(e) => setRet(e.target.value)}
                  onKeyPress={handleKeyPress}
                  error={errors.ret}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <Label>Travelers</Label>
              <Select
                icon={UsersIcon}
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value || 1))}
                error={errors.travelers}
              >
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Cabin Class</Label>
              <Select value={cabin} onChange={(e) => setCabin(e.target.value)}>
                {cabinOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Stops</Label>
              <Select value={stops} onChange={(e) => setStops(e.target.value)}>
                {stopsOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <button
            onClick={onSearch}
            disabled={loading}
            className="w-full md:w-auto gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            <div className="flex items-center justify-center gap-3">
              {loading ? <SpinnerIcon /> : <SearchIcon />}
              {loading ? "Searching..." : "Search Flights"}
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border border-red-300 bg-red-50 text-red-800 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {deals.length > 0 && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-200 mb-3">
                ✈️ Found {deals.length} Amazing Flights
              </h2>
              <p className="text-slate-400 text-lg">
                Sorted by AI score and best value • Updated in real-time
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {deals.map((deal, index) => (
                <DealCard key={index} deal={deal} index={index} onViewDetails={handleViewDetails} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && deals.length === 0 && !error && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-32 h-32 mx-auto mb-8 p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full">
              {/* <PlaneIcon /> */}
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4">
              Your Next Adventure Awaits! ✈️
            </h3>
            <p className="text-slate-600 max-w-md mx-auto text-lg leading-relaxed">
              Enter your travel details above and let our AI-powered engine discover the perfect flights for your journey.
            </p>
            <div className="mt-8 text-sm text-slate-500">
              💡 Pro tip: Leave destination empty to explore "anywhere" deals
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-4 text-blue-600 mb-4">
              <SpinnerIcon />
              <span className="text-xl font-semibold">Searching for the best deals...</span>
            </div>
            <p className="text-slate-600 mb-6">Our AI is analyzing thousands of flights for you</p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>

      {/* Flight Detail Modal */}
      <FlightDetailModal 
        deal={selectedDeal}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}