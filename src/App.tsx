import Header from './components/Header';
import InventoryTable from './components/InventoryTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Status</h2>

        <InventoryTable />
      </main>
    </div>
  );
}

<div className="bg-red-500 text-white p-4">
  If this is not red with white text, Tailwind is broken.
</div>

export default App;
