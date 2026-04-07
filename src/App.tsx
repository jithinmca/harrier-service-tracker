import React, { useState, useEffect } from 'react';
import { Plus, Car, Calendar, Settings, ChevronRight, X, Gauge, AlertCircle, CheckCircle2, Droplet, ShieldCheck, Wrench, ChevronLeft, Pencil, Info } from 'lucide-react';
import { serviceData } from './serviceData';
import './index.css';

interface Vehicle {
  id: string;
  name: string;
  variant: string;
  purchaseMonth: number;
  purchaseYear: number;
  odometer: number;
  driveType: 'QWD' | 'RWD';
}

type AppState = 'home' | 'vehicleDetail' | 'serviceDetails';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('harrier-service-vehicles');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [appState, setAppState] = useState<AppState>('home');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<{ index: number, interval: any } | null>(null);

  // Add Vehicle Form
  const [newVariant, setNewVariant] = useState('');
  const [newName, setNewName] = useState('');
  const [newMonth, setNewMonth] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newDriveType, setNewDriveType] = useState<'QWD' | 'RWD'>('QWD');

  // Persist vehicles
  useEffect(() => {
    localStorage.setItem('harrier-service-vehicles', JSON.stringify(vehicles));
    if (selectedVehicle) {
      const updated = vehicles.find(v => v.id === selectedVehicle.id);
      if (updated) setSelectedVehicle(updated);
    }
  }, [vehicles]);

  const closePopup = () => {
    setShowAddPopup(false);
    setEditingVehicleId(null);
    setNewVariant('');
    setNewName('');
    setNewMonth('');
    setNewYear('');
    setNewDriveType('QWD');
  };

  const handleEditClick = (v: Vehicle) => {
    setNewVariant(v.variant);
    setNewName(v.name || '');
    setNewMonth(v.purchaseMonth.toString());
    setNewYear(v.purchaseYear.toString());
    setNewDriveType((v.driveType as any) === 'AWD' ? 'QWD' : (v.driveType || 'QWD'));
    setEditingVehicleId(v.id);
    setShowAddPopup(true);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVariant || !newMonth || !newYear) return;
    
    if (editingVehicleId) {
      setVehicles(prev => prev.map(v => v.id === editingVehicleId ? {
        ...v,
        variant: newVariant,
        name: newName,
        purchaseMonth: parseInt(newMonth),
        purchaseYear: parseInt(newYear),
        driveType: newDriveType
      } : v));
    } else {
      const newVehicle: Vehicle = {
        id: Math.random().toString(36).substring(7),
        variant: newVariant,
        name: newName || '',
        purchaseMonth: parseInt(newMonth),
        purchaseYear: parseInt(newYear),
        odometer: 0,
        driveType: newDriveType
      };
      setVehicles([...vehicles, newVehicle]);
    }
    closePopup();
  };

  const updateOdometer = (id: string, km: number) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, odometer: km } : v));
  };

  const getElapsedMonths = (v: Vehicle | null) => {
    if (!v) return 0;
    const currentDate = new Date();
    const currM = currentDate.getMonth() + 1;
    const currY = currentDate.getFullYear();
    return Math.max(0, (currY - v.purchaseYear) * 12 + (currM - v.purchaseMonth));
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const isFreeService = (index: number) => index <= 3;

  // Month / Year dropdown logic
  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth() + 1;
  const availableYears = [];
  for (let y = 2025; y <= currYear; y++) availableYears.push(y);

  const getAvailableMonths = (year: string) => {
    if (!year) return [];
    const y = parseInt(year);
    let start = 1;
    let end = 12;
    if (y === 2025) start = 6; // Min June 2025
    if (y === currYear) end = currMonth; // Max current month
    const months = [];
    for (let m = start; m <= end; m++) months.push(m);
    return months;
  };

  // --- RENDERING ---

  const renderTopbar = (title: string, backAction?: () => void) => (
    <div className="glass-header flex items-center justify-between" style={{ padding: '20px' }}>
      <div className="flex items-center gap-3">
        {backAction && (
          <button className="btn-icon" onClick={backAction} style={{ width: '36px', height: '36px' }}>
            <ChevronLeft size={20} color="var(--accent-primary)" />
          </button>
        )}
        <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', letterSpacing: '0.5px' }}>{title}</h1>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="animate-fade-in flex flex-col" style={{ height: '100dvh' }}>
      {renderTopbar('Harrier EV Service')}
      
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <button 
              className="btn-icon" 
              onClick={() => setShowAddPopup(true)} 
              style={{ width: '80px', height: '80px', background: 'var(--accent-primary)', border: 'none', boxShadow: '0 8px 32px var(--accent-glow)' }}
            >
              <Plus size={40} color="#000" />
            </button>
            <p className="text-muted mt-6" style={{ fontSize: '1.1rem' }}>Tap to add your vehicle</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vehicles.map(v => (
              <div key={v.id} className="card animate-slide-up flex justify-between items-center" onClick={() => { setSelectedVehicle(v); setAppState('vehicleDetail'); }} style={{ cursor: 'pointer', marginBottom: '16px' }}>
                <div className="flex items-center gap-4">
                  <div style={{ background: 'rgba(0,229,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                    <Car color="var(--accent-primary)" size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>{v.name ? `${v.name} (${v.variant})` : v.variant}</h3>
                    <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.85rem' }}>
                      <Calendar size={14} />
                      <span>{getElapsedMonths(v)} months old • {v.driveType === 'AWD' as any ? 'QWD' : (v.driveType || 'QWD')}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight color="var(--text-muted)" size={20} />
              </div>
            ))}
            <div className="flex justify-center mt-6">
               <button 
                className="btn-icon" 
                onClick={() => setShowAddPopup(true)} 
                style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border-color)' }}
              >
                <Plus size={24} color="var(--text-muted)" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderVehicleDetail = () => {
    if (!selectedVehicle) return null;
    const elapsedMonths = getElapsedMonths(selectedVehicle);
    const title = selectedVehicle.name ? `${selectedVehicle.name} (${selectedVehicle.variant})` : selectedVehicle.variant;
    
    // Service calculation
    const km = selectedVehicle.odometer || 0;
    
    let upcomingIdx: number;
    let nextService: any;
    let previousIdx: number = -1;
    let previousService: any = null;

    let standardIdx = serviceData.serviceIntervals.findIndex(i => i.km > km && i.month > elapsedMonths);
    
    if (standardIdx !== -1) {
      upcomingIdx = standardIdx + 1;
      nextService = serviceData.serviceIntervals[standardIdx];
      if (standardIdx > 0) {
        previousIdx = standardIdx;
        previousService = serviceData.serviceIntervals[standardIdx - 1];
      }
    } else {
      // Beyond 150,000 km extrapolate using 7500km/6mo increments
      const nextKmMultiplier = Math.floor(km / 7500) + 1;
      const nextMonthMultiplier = Math.floor(elapsedMonths / 6) + 1;
      const cycle = Math.max(nextKmMultiplier, nextMonthMultiplier, 21); // Interval multiplier mapping

      upcomingIdx = cycle; // 1st = 1, 21st = 150k
      nextService = { month: cycle * 6, km: cycle * 7500 };
      
      previousIdx = cycle - 1;
      previousService = { month: (cycle - 1) * 6, km: (cycle - 1) * 7500 };
    }

    return (
      <div className="animate-fade-in flex flex-col" style={{ height: '100dvh' }}>
        {renderTopbar('Harrier EV Service', () => setAppState('home'))}
        
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex justify-between items-center">
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-primary)', flex: 1 }}>{title}</h2>
              <button 
                onClick={() => handleEditClick(selectedVehicle)} 
                style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Pencil size={18} color="var(--text-muted)" />
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-[var(--border-color)] mt-2" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <Calendar color="var(--text-muted)" size={18} />
                <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>{elapsedMonths} months old</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge color="var(--text-muted)" size={18} />
                <input 
                  type="number" 
                  placeholder="Odometer (km)"
                  value={selectedVehicle.odometer || ''}
                  onChange={e => updateOdometer(selectedVehicle.id, parseInt(e.target.value) || 0)}
                  style={{ width: '120px', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', textAlign: 'right' }}
                />
              </div>
            </div>
          </div>

          <h3 className="mb-4 text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Service Status</h3>

          <div className="flex flex-col gap-4">
            {/* Previous / Overdue Service Button */}
            {previousService && (
              <div 
                className="card animate-slide-up" 
                onClick={() => {
                  setSelectedServiceForDetail({ index: previousIdx, interval: previousService });
                  setAppState('serviceDetails');
                }}
                style={{ 
                  cursor: 'pointer', 
                  border: '1px solid rgba(255, 59, 48, 0.3)', 
                  background: 'rgba(255, 59, 48, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#FF3B30' }}></div>
                <div className="flex justify-between items-center pl-3">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                      {getOrdinal(previousIdx)} Service ({isFreeService(previousIdx) ? 'Free' : 'Paid'})
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: '#FF3B30', fontWeight: 500 }} className="flex items-center gap-2">
                      <AlertCircle size={14} />
                      {(() => {
                        const mDiff = Math.max(0, elapsedMonths - previousService.month);
                        const kDiff = Math.max(0, km - previousService.km);
                        if (mDiff > 0 && kDiff > 0) return `Overdue by ${mDiff} mo / ${kDiff.toLocaleString()} km`;
                        if (mDiff > 0) return `Overdue by ${mDiff} mo`;
                        if (kDiff > 0) return `Overdue by ${kDiff.toLocaleString()} km`;
                        return 'Previously Due completed or approaching limit';
                      })()}
                    </div>
                    <div className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                      Milestone: {previousService.month} mo / {previousService.km.toLocaleString()} km
                    </div>
                  </div>
                  <ChevronRight color="var(--text-muted)" />
                </div>
              </div>
            )}

            {/* Upcoming Service Button */}
            <div 
              className="card animate-slide-up" 
              onClick={() => {
                setSelectedServiceForDetail({ index: upcomingIdx, interval: nextService });
                setAppState('serviceDetails');
              }}
              style={{ 
                cursor: 'pointer', 
                border: '1px solid rgba(0, 229, 255, 0.3)', 
                background: 'rgba(0, 229, 255, 0.05)',
                animationDelay: '0.1s',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-primary)' }}></div>
              <div className="flex justify-between items-center pl-3">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                    {getOrdinal(upcomingIdx)} Service ({isFreeService(upcomingIdx) ? 'Free' : 'Paid'})
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 500 }} className="flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    {(() => {
                      const mLeft = nextService.month - elapsedMonths;
                      const kLeft = nextService.km - km;
                      return `Due in ${mLeft > 0 ? mLeft : 0} mo or ${kLeft > 0 ? kLeft.toLocaleString() : 0} km`;
                    })()}
                  </div>
                  <div className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                    Milestone: {nextService.month} mo / {nextService.km.toLocaleString()} km
                  </div>
                </div>
                <ChevronRight color="var(--text-muted)" />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'replace': return <Droplet size={16} color="#FF3B30" />;
      case 'inspect': return <ShieldCheck size={16} color="#FFD60A" />;
      case 'tighten': return <Wrench size={16} color="#FF9F0A" />;
      default: return <Settings size={16} color="var(--accent-primary)" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'replace': return 'rgba(255, 59, 48, 0.15)';
      case 'inspect': return 'rgba(255, 214, 10, 0.15)';
      case 'tighten': return 'rgba(255, 159, 10, 0.15)';
      default: return 'rgba(0, 229, 255, 0.15)';
    }
  };

  const getActionTextColor = (action: string) => {
    switch (action) {
      case 'replace': return '#FF3B30';
      case 'inspect': return '#FFD60A';
      case 'tighten': return '#FF9F0A';
      default: return 'var(--accent-primary)';
    }
  };

  const getServiceItems = (serviceObj: { month: number; km: number }) => {
    interface ViewItem { id: number; name: string; action: string; info?: string }
    const result: { group: string; items: ViewItem[] }[] = [];

    serviceData.groups.forEach(group => {
      const activeItems = group.items.filter((item: any) => {
        const interval = item.interval || {};
        if (interval.everyService) return true;
        if (interval.everyKm && serviceObj.km > 0 && serviceObj.km % interval.everyKm === 0) return true;
        if (interval.everyMonths && serviceObj.month > 0 && serviceObj.month % interval.everyMonths === 0) return true;
        if (interval.specificKms && interval.specificKms.includes(serviceObj.km)) return true;
        return false;
      });

      if (activeItems.length > 0) {
        result.push({
          group: group.name,
          items: activeItems.map((i: any) => ({ id: i.id, name: i.name, action: i.action, info: i.info }))
        });
      }
    });
    return result;
  };

  const renderServiceDetails = () => {
    if (!selectedServiceForDetail || !selectedVehicle) return null;
    const { index, interval } = selectedServiceForDetail;
    const isFree = isFreeService(index);
    const items = getServiceItems(interval);

    return (
      <div className="animate-slide-up flex flex-col" style={{ height: '100dvh' }}>
        {renderTopbar(`${getOrdinal(index)} Service Details`, () => setAppState('vehicleDetail'))}

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getOrdinal(index)} Service
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding:'4px 8px', borderRadius:'6px', fontWeight: 500 }}>{isFree ? 'Free' : 'Paid'}</span>
              </h2>
              <div className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
                Schedule: {interval.month} Months or {interval.km.toLocaleString()} km
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8" style={{ paddingBottom: '40px' }}>
            {items.map((group, idx) => (
              <div key={idx} className="animate-fade-in card p-5" style={{ animationDelay: `${idx * 0.1}s`, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                <h4 className="mb-4" style={{ fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, color: 'var(--accent-primary)', borderBottom: '1px solid rgba(0, 229, 255, 0.2)', paddingBottom: '8px' }}>
                  {group.group}
                </h4>
                <div className="flex flex-col gap-4">
                  {group.items.map(item => {
                    const isFrontMotorTask = item.id === 19 || item.name.toLowerCase().includes('front e-drive');
                    const shouldStrike = selectedVehicle?.driveType === 'RWD' && isFrontMotorTask;
                    return (
                    <div key={item.id} className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', opacity: shouldStrike ? 0.5 : 1 }}>
                      <div className="flex justify-between items-start gap-4">
                        <div style={{ flex: 1, fontSize: '0.95rem', lineHeight: 1.5, color: shouldStrike ? 'var(--text-muted)' : '#E2E8F0', textDecoration: shouldStrike ? 'line-through' : 'none' }}>
                          {item.name}
                          {shouldStrike && <div style={{fontSize: '0.75rem', marginTop: '4px', textDecoration: 'none', color: 'var(--accent-primary)', display: 'block'}}>(Not applicable for RWD)</div>}
                        </div>
                        <div style={{ 
                          background: getActionColor(item.action), 
                          color: getActionTextColor(item.action),
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexShrink: 0
                        }}>
                          {getActionIcon(item.action)}
                          {item.action === 'service' ? 'Inspect/Svc' : item.action}
                        </div>
                      </div>
                      
                      {item.info && !shouldStrike && (
                        <div className="flex items-start gap-2 mt-1 px-3 py-2 rounded" style={{ background: 'rgba(0, 229, 255, 0.06)', borderLeft: '3px solid var(--accent-primary)' }}>
                          <Info size={14} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '0.8rem', color: '#B0E0E6', lineHeight: 1.4 }}>{item.info}</span>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {appState === 'home' && renderHome()}
      {appState === 'vehicleDetail' && renderVehicleDetail()}
      {appState === 'serviceDetails' && renderServiceDetails()}

      {showAddPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600 }}>{editingVehicleId ? 'Edit Vehicle' : 'Add Harrier EV'}</h2>
              <button className="btn-icon" onClick={closePopup} style={{ width: '32px', height: '32px' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddVehicle} className="flex flex-col gap-4">
              <div>
                <label>Variant</label>
                <input type="text" placeholder="e.g. Empowered+" value={newVariant} onChange={e => setNewVariant(e.target.value)} required />
              </div>
              <div>
                <label>Nickname (Optional)</label>
                <input type="text" placeholder="e.g. White Beast" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <label>Purchase Year</label>
                  <select 
                    value={newYear} 
                    onChange={e => { setNewYear(e.target.value); setNewMonth(''); }} 
                    required
                    style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="" disabled>Year</option>
                    {availableYears.map(y => <option key={y} value={y} style={{color:'#000'}}>{y}</option>)}
                  </select>
                </div>
                <div className="w-full">
                  <label>Month</label>
                  <select 
                    value={newMonth} 
                    onChange={e => setNewMonth(e.target.value)} 
                    required
                    disabled={!newYear}
                    style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="" disabled>Month</option>
                    {getAvailableMonths(newYear).map(m => <option key={m} value={m} style={{color:'#000'}}>{new Date(2000, m-1).toLocaleString('default', { month: 'short' })}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <label>Drive Type</label>
                  <select 
                    value={newDriveType} 
                    onChange={e => setNewDriveType(e.target.value as 'QWD' | 'RWD')} 
                    required
                    style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="QWD" style={{color:'#000'}}>QWD (Quad Wheel Drive)</option>
                    <option value="RWD" style={{color:'#000'}}>RWD (Rear-Wheel Drive)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary mt-4">{editingVehicleId ? 'Save Changes' : 'Add Vehicle'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
