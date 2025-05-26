import { useState, useEffect } from 'react';
import { inventoryItems } from '../data/inventoryData';

const InventoryTable = () => {
  const [currentCounts, setCurrentCounts] = useState<{ [key: number]: number }>({});
  const [errors, setErrors] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const initialCounts: { [key: number]: number } = {};
    inventoryItems.forEach(item => {
      initialCounts[item.id] = item.required;
    });
    setCurrentCounts(initialCounts);
  }, []);

  const handleChange = (id: number, value: number, required: number) => {
    if (value <= required) {
      setCurrentCounts(prev => ({ ...prev, [id]: value }));
      setErrors(prev => ({ ...prev, [id]: false }));
    } else {
      setErrors(prev => ({ ...prev, [id]: true }));
    }
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
            const current = currentCounts[item.id] ?? item.required;
            const difference = current - item.required;

            return (
              <tr key={item.id} className="border-b align-top">
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.required}</td>
                <td className="p-3 border">
                  <input
                    type="number"
                    min={0}
                    max={item.required}
                    className="w-24 border rounded px-2 py-1"
                    value={current}
                    onChange={e =>
                      handleChange(item.id, Number(e.target.value), item.required)
                    }
                  />
                  {errors[item.id] && (
                    <p className="text-xs text-red-500 mt-1">
                      Value cannot exceed required amount.
                    </p>
                  )}
                </td>
                <td className="p-3 border font-semibold !text-red-600">
                  {Math.abs(difference)}
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
