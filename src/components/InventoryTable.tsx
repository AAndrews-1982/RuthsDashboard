import { useState } from 'react';
import { inventoryItems } from '../data/inventoryData';

const InventoryTable = () => {
  const [currentCounts, setCurrentCounts] = useState<{ [key: number]: number }>({});

  const handleChange = (id: number, value: number) => {
    setCurrentCounts(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mt-4 text-left">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-3 border">Item</th>
            <th className="p-3 border">Required</th>
            <th className="p-3 border">Current</th>
            <th className="p-3 border">Difference</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map(item => {
            const current = currentCounts[item.id] ?? 0;
            const difference = current - item.required;

            return (
              <tr key={item.id} className="border-b">
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.required}</td>
                <td className="p-3 border">
                  <input
                    type="number"
                    className="w-24 border rounded px-2 py-1"
                    value={current}
                    onChange={e => handleChange(item.id, Number(e.target.value))}
                  />
                </td>
                <td className="p-3 border font-semibold text-red-600">
                  {difference}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
