import { useState, useEffect } from 'react';
import { inventoryItems } from '../data/inventoryData';

const InventoryTable = () => {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [selectedLocation, setSelectedLocation] = useState('All');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const formatDate = (y: number, m: number, d: number) => `${monthNames[m - 1]} ${d}, ${y}`;
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

  const handleSetToday = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
    setSelectedDay(now.getDate());
  };

  useEffect(() => {
    const initialQuantities: { [key: number]: number } = {};
    const initialNotes: { [key: number]: string } = {};
    inventoryItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity ?? 0;
      initialNotes[item.id] = item.notes ?? '';
    });
    setQuantities(initialQuantities);
    setNotes(initialNotes);
  }, []);

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleNoteChange = (id: number, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const locations = ['All', 'Refrigerator', 'Freezer', 'Dry Storage'];
  const filteredItems = selectedLocation === 'All' ? inventoryItems : inventoryItems.filter((item) => item.location === selectedLocation);

  const groupedItems = filteredItems.reduce((groups, item) => {
    const loc = item.location;
    if (!groups[loc]) groups[loc] = [];
    groups[loc].push(item);
    return groups;
  }, {} as Record<string, typeof inventoryItems>);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {/* Date Picker */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Select Date:</label>
            <div className="flex gap-2">
              <select className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                {monthNames.map((month, idx) => (
                  <option key={`month-${month}`} value={idx + 1}>{month}</option>
                ))}
              </select>
              <select className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))}>
                {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => (
                  <option key={`day-${i + 1}`} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                {[2025, 2026, 2027].map((year) => (
                  <option key={`year-${year}`} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSetToday} className="mt-1 sm:mt-0 px-4 py-2 text-sm font-semibold bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">Set Today</button>
          </div>
        </div>

        <div className="text-gray-700 font-medium mb-4">
          Selected Date: <span className="text-black font-semibold">{formatDate(selectedYear, selectedMonth, selectedDay)}</span>
        </div>

        {/* Location Filter */}
        <div className="flex flex-wrap gap-4 my-6">
          {locations.map((loc) => (
            <button key={`location-${loc}`} onClick={() => setSelectedLocation(loc)} className={`px-5 py-2 rounded-lg text-sm font-medium shadow-md transition ${selectedLocation === loc ? 'bg-yellow-500 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-yellow-100'}`}>{loc}</button>
          ))}
        </div>

        {/* Inventory Table */}
        <table className="w-full border-collapse text-sm sm:text-base shadow-sm rounded-xl overflow-hidden">
          <thead className="bg-yellow-300 text-gray-800 uppercase text-xs tracking-wide sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 border">Item Location</th>
              <th className="px-4 py-3 border">Brand</th>
              <th className="px-4 py-3 border">Item Name</th>
              <th className="px-4 py-3 border">Purchased From</th>
              <th className="px-4 py-3 border">Quantity</th>
              <th className="px-4 py-3 border">Required</th>
              <th className="px-4 py-3 border">To Order</th>
              <th className="px-4 py-3 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedItems).flatMap(([location, items]) => [
              <tr key={`group-${location}`} className="bg-gray-100">
                <td colSpan={8} className="p-3 font-bold text-lg text-gray-700">{location}</td>
              </tr>,
              ...items.map((item) => {
                const quantity = quantities[item.id] ?? 0;
                const required = item.required;
                const needToPurchase = Math.max(required - quantity, 0);

                return (
                  <tr key={`item-${item.id}`} className="border-b align-top">
                    <td className="px-4 py-3 border">{item.location}</td>
                    <td className="px-4 py-3 border">{item.brand}</td>
                    <td className="px-4 py-3 border">{item.itemName}</td>
                    <td className="px-4 py-3 border">{item.purchasedFrom}</td>
                    <td className="px-4 py-3 border">
                      <select
                        className="w-full text-sm border border-gray-300 rounded-md bg-white shadow-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                      >
                        {Array.from({ length: item.required + 1 }, (_, i) => (
                          <option key={`qty-${item.id}-${i}`} value={i}>{i}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 border">{required}</td>
                    <td className="px-4 py-3 border font-bold text-red-500 bg-red-50">{needToPurchase}</td>
                    <td className="px-4 py-3 border">
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm resize-none"
                        rows={2}
                        placeholder="Add notes..."
                        value={notes[item.id] || ''}
                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })
            ])}
          </tbody>
        </table>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="sm:mr-auto">
            <img src="/RuthsLogo-1.png" alt="Ruth's Chicken Logo" className="h-6 w-auto object-contain" />
          </div>
          <div className="text-center sm:text-right max-w-sm sm:ml-auto">
            Internal use only. Inventory is to be completed by authorized Team Members only.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InventoryTable;
