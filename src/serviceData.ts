export const serviceData = {
  serviceIntervals: [
    { month: 2, km: 1500 },
    { month: 6, km: 7500 },
    { month: 12, km: 15000 },
    { month: 18, km: 22500 },
    { month: 24, km: 30000 },
    { month: 30, km: 37500 },
    { month: 36, km: 45000 },
    { month: 42, km: 52500 },
    { month: 48, km: 60000 },
    { month: 54, km: 67500 },
    { month: 60, km: 75000 },
    { month: 66, km: 82500 },
    { month: 72, km: 90000 },
    { month: 78, km: 97500 },
    { month: 84, km: 105000 },
    { month: 90, km: 112500 },
    { month: 96, km: 120000 },
    { month: 102, km: 127500 },
    { month: 108, km: 135000 },
    { month: 114, km: 142500 },
    { month: 120, km: 150000 }
  ],
  groups: [
    {
      name: "General",
      items: [
        { id: 1, name: "Wash vehicle and clean condenser fins", action: "service", interval: { everyService: true } },
        { id: 2, name: "Check and top up fluids (if required) - Transaxle Oil, Coolant, Brake Fluid, Battery Electrolyte, Wind screen washer", action: "service", interval: { everyService: true } },
        { id: 3, name: "Check HV battery box for cracks or leakage", action: "service", interval: { everyService: true } },
        { id: 4, name: "Check HV cables for looseness or damage", action: "service", interval: { everyService: true } },
        { id: 5, name: "Clean charging socket and hinge area", action: "service", interval: { everyService: true } },
        { id: 6, name: "Replace HV battery breather plug", action: "replace", interval: { everyKm: 30000 } },
        { id: 7, name: "Inspect battery and traction cooling systems", action: "service", interval: { everyService: true } },
        { id: 8, name: "Replace cooling system coolant", action: "replace", interval: { everyKm: 60000, everyMonths: 36 } },
        { id: 9, name: "Run diagnostics and clear fault codes", action: "service", interval: { everyService: true } },
        { id: 10, name: "Check all door latches & striker operations, apply grease if required", action: "inspect", interval: { everyKm: 15000 } },
        { id: 11, name: "Check tightening torque of structural components", action: "tighten", interval: { everyService: true } },
        { id: 12, name: "Check tightening of all bolts and nuts", action: "tighten", interval: { everyService: true }, info: "For severe usage, checks to be done every 5,000 km or after every severe event." },
        { id: 13, name: "Inspect suspension bushes, joints and steering components. Replace if necessary.", action: "inspect", interval: { everyService: true }, info: "For severe usage, checks to be done every 5,000 km or after every severe event." }
      ]
    },
    {
      name: "Brakes",
      items: [
        { id: 14, name: "Check front & rear brake pads. Replace if necessary.", action: "inspect", interval: { everyKm: 15000 } },
        { id: 15, name: "Replace brake fluid and check brake system components for leakages", action: "replace", interval: { everyKm: 45000, everyMonths: 24 } },
        { id: 16, name: "Check electronic parking brake operation", action: "inspect", interval: { everyKm: 15000 } }
      ]
    },
    {
      name: "Wheels & Tyres",
      items: [
        { id: 17, name: "Wheel alignment & balancing", action: "inspect", interval: { everyKm: 15000 }, info: "For severe usage, checks to be done every 5,000 km or after every severe event." },
        { id: 18, name: "Check Tyre pressure, condition & rotate", action: "inspect", interval: { everyKm: 7500 } }
      ]
    },
    {
      name: "Transaxle",
      items: [
        { id: 19, name: "Front e-Drive Oil change", action: "replace", interval: { everyKm: 30000, specificKms: [7500] } }
      ]
    },
    {
      name: "Electrical",
      items: [
        { id: 20, name: "Check specific gravity of battery electrolyte for 12V Aux. battery", action: "inspect", interval: { everyKm: 7500 } },
        { id: 21, name: "Headlamp focusing", action: "inspect", interval: { everyKm: 15000 } }
      ]
    },
    {
      name: "AC System",
      items: [
        { id: 22, name: "Inspect HVAC system performance", action: "service", interval: { everyService: true } },
        { id: 23, name: "Replace pollen filter (if applicable)", action: "replace", interval: { everyKm: 15000 } },
        { id: 24, name: "Replace PM2.5 filter (if applicable)", action: "replace", interval: { everyKm: 15000 } }
      ]
    },
    {
      name: "Sunroof",
      items: [
        { id: 25, name: "Clean guide rails and drain holes", action: "inspect", interval: { everyKm: 15000 } }
      ]
    },
    {
      name: "Exterior Trim",
      items: [
        { id: 26, name: "Grease charging port hinge", action: "inspect", interval: { everyKm: 15000 } }
      ]
    }
  ]
};
