import Header from './components/Header';
import InventoryTable from './components/InventoryTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Status</h2>

        {/* 🔴 Tailwind Text Color Test */}
        <div className="text-red-600 text-xl font-bold">Tailwind Red Test</div>

        <InventoryTable />
      </main>
    </div>
  );
}

export default App;
