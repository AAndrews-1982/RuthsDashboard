import React, { useState, useEffect } from 'react'; // ✅ React must be in scope
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

  const formatDate = (y: number, m: number, d: number) =>
    `${monthNames[m - 1]} ${d}, ${y}`;

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

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

  const filteredItems =
    selectedLocation === 'All'
      ? inventoryItems
      : inventoryItems.filter((item) => item.location === selectedLocation);

  const groupedItems = filteredItems.reduce((groups, item) => {
    const loc = item.location;
    if (!groups[loc]) groups[loc] = [];
    groups[loc].push(item);
    return groups;
  }, {} as Record<string, typeof inventoryItems>);

  return (
    <div className="overflow-x-auto">

      {/* Date Picker and Today Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <div className="flex gap-2">
            <select
              className="border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {monthNames.map((month, idx) => (
                <option key={`month-${month}`} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
            >
              {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => (
                <option key={`day-${i + 1}`} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              className="border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[2025, 2026, 2027].map((year) => (
                <option key={`year-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Smaller "Set Today" button under the date */}
          <button
            onClick={handleSetToday}
            className="mt-2 w-fit px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
          >
            Set Today
          </button>
        </div>
      </div>

      <div className="text-gray-700 font-medium mb-4">
        Selected Date:{' '}
        <span className="text-black">
          {formatDate(selectedYear, selectedMonth, selectedDay)}
        </span>
      </div>

      {/* ✅ Larger Location Filter Buttons with spacing */}
      <div className="flex flex-wrap gap-4 my-6">
        {locations.map((loc) => (
          <button
            key={`location-${loc}`}
            onClick={() => setSelectedLocation(loc)}
            className={`px-30 py-20 text-lg rounded-xl font-semibold shadow ${
              selectedLocation === loc
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-yellow-100'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <table className="w-full border-collapse mt-4 text-left text-sm sm:text-base">
        <thead className="bg-yellow-200 text-md">
          <tr>
            <th className="p-3 border">Item Location</th>
            <th className="p-3 border">Brand</th>
            <th className="p-3 border">Item Name</th>
            <th className="p-3 border">Purchased From</th>
            <th className="p-3 border">Quantity</th>
            <th className="p-3 border">Required Quantity</th>
            <th className="p-3 border">Need to Purchase</th>
            <th className="p-3 border">Notes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedItems).flatMap(([location, items]) => {
            const locationRow = (
              <tr key={`group-${location}`} className="bg-gray-100">
                <td colSpan={8} className="p-3 font-bold text-lg text-gray-700">
                  {location}
                </td>
              </tr>
            );

            const itemRows = items.map((item) => {
              const quantity = quantities[item.id] ?? 0;
              const required = item.required;
              const needToPurchase = Math.max(required - quantity, 0);

              return (
                <tr key={`item-${item.id}`} className="border-b align-top">
                  <td className="p-3 border">{item.location}</td>
                  <td className="p-3 border">{item.brand}</td>
                  <td className="p-3 border">{item.itemName}</td>
                  <td className="p-3 border">{item.purchasedFrom}</td>
                  <td className="p-3 border">
                    <select
                      className="w-full text-base border border-red-500 rounded bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    >
                      {Array.from({ length: item.required + 1 }, (_, i) => (
                        <option key={`qty-${item.id}-${i}`} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border">{required}</td>
                  <td className="p-3 border font-semibold text-red-600">
                    {needToPurchase}
                  </td>
                  <td className="p-3 border">
                    <textarea
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      rows={2}
                      placeholder="Add notes..."
                      value={notes[item.id] || ''}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    />
                  </td>
                </tr>
              );
            });

            return [locationRow, ...itemRows];
          })}
        </tbody>
      </table>

      {/* Footer */}
      <footer className="mt-10 pt-6 pb-20 border-t flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 px-4">
        <div className="sm:mr-auto">
          <img
            src="/RuthsLogo-1.png"
            alt="Ruth's Chicken Logo"
            className="h-6 w-auto object-contain"
          />
        </div>
        <div className="text-center sm:text-right max-w-sm sm:ml-auto mt-4 sm:mt-0">
          Internal use only. Inventory is to be completed by authorized Team Members Only.
        </div>
      </footer>
    </div>
  );
};

export default InventoryTable;
