import { useState } from 'react';
import { Product, Charm, CategoryProduct, CharmCategory, Clasp } from '../../types';
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { StockUpdateForm } from './StockUpdateForm';
import { 
  Package, 
  Sparkles, 
  Search, 
  AlertTriangle,
  TrendingDown,
  Edit,
  ClipboardPaste 
} from 'lucide-react';

type StockItem = (Product | Charm | Clasp) & {
  type: 'product' | 'charm' | 'clasp';
  categoryName?: string;
};

export function StockManagement() {
  const { data: products, update: updateProduct } = useFirebaseCollection<Product>('Products', 'name', 'asc');
  const { data: charms, update: updateCharm } = useFirebaseCollection<Charm>('Charms', 'name', 'asc');
  const { data: Clasps, update: updateClasp } = useFirebaseCollection<Clasp>('Clasps', 'name', 'asc');
  const { data: productCategories } = useFirebaseCollection<CategoryProduct>('ProductCategory', 'name', 'asc');
  const { data: charmCategories } = useFirebaseCollection<CharmCategory>('CharmCategory', 'name', 'asc');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'product' | 'charm'>('all');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // Combiner les produits et breloques avec leurs catégories
  const stockItems: StockItem[] = [
    ...products.map(product => ({
      ...product,
      type: 'product' as const,
      categoryName: productCategories.find(cat => cat.id === product.categoryId)?.name.fr || 'Catégorie inconnue'
    })),
    ...charms.map(charm => ({
      ...charm,
      type: 'charm' as const,
      categoryName: charmCategories.find(cat => cat.id === charm.categoryId)?.name.fr || 'Catégorie inconnue'
    })),
    ...Clasps.map(clasp => ({
      ...clasp,
      type: 'clasp' as const,
      categoryName: "Fermoir"
    }))
  ];

  // Filtrer les éléments
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.categoryName!.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    const matchesStock = filterStock === 'all' || 
                        (filterStock === 'low' && item.stock <= item.minStock && item.stock > 0) ||
                        (filterStock === 'out' && item.stock === 0);
    
    return matchesSearch && matchesType && matchesStock;
  });

  // Statistiques
  const stats = {
    totalProducts: products.length,
    totalCharms: charms.length,
    totalClasps: Clasps.length,
    lowStockItems: stockItems.filter(item => item.stock <= item.minStock && item.stock > 0).length,
    outOfStockItems: stockItems.filter(item => item.stock === 0).length,
  };

  // Function to convert an array of objects to CSV format
// function convertToCSV(data: StockItem[]): string {
//   if (data.length === 0) {
//     return "";
//   }

//   // Extract headers (keys of the first object)
//   // const headers = Object.keys(data[0]).join(",");
//   const headers = ['id', 'name', 'refProvider', 'NameProvider'];

//   // Map each object to a CSV row
//   const rows = data.map((row) => {
//     const el = {
//       id: row.id,
//       name: row.name,
//       refProvider: row.providerRef ? row.providerRef : "#RefProduct",
//       nameProvider: row.providerId ? row.providerRef : "#RefProduct",
//     }
//     Object.values(el)
//     .map((value) => `"${value}"`) // Wrap values in quotes to handle commas
//     .join(",")
//   });

//   // Combine headers and rows
//   return [headers, ...rows].join("\n");
// }

// Function to trigger a CSV file download
function downloadCSV(filename: string, csvContent: string): void {
  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv" });

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Append the link to the document, trigger the download, and remove the link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  const handleExport = async () => {
    // const csvContent = convertToCSV(filteredItems);
    // if (csvContent) {
    //   downloadCSV("MDSNC-stock-data.csv", csvContent);
    // } else {
    //   alert("No data available to export.");
    // }
  }

  const handleStockUpdate = async (data: { stock: number; minStock: number }) => {
    if (!editingItem) return;

    try {
      switch(editingItem.type) {
        default:
          await updateProduct(editingItem.id!, { 
            stock: data.stock, 
            minStock: data.minStock 
          });
        break;
        case "charm":
          await updateCharm(editingItem.id!, { 
            stock: data.stock, 
            minStock: data.minStock 
          });
        break;
        case 'clasp':
          await updateClasp(editingItem.id!, {
            stock: data.stock,
            minStock: data.minStock
          });
        break;
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
    }
  };

  const getStockStatus = (item: StockItem) => {
    if (item.stock === 0) {
      return { status: 'out', color: 'bg-red-200 text-red-800', label: 'Rupture' };
    } else if (item.stock <= item.minStock) {
      return { status: 'low', color: 'bg-orange-200 text-orange-800', label: 'Stock faible' };
    } else {
      return { status: 'good', color: 'bg-green-200 text-green-800', label: 'OK' };
    }
  };

  function ItemCard(_item: StockItem) {
    const stockStatus = getStockStatus(_item);
    return (
      <Card key={_item.id} className='h-1/4 rounded-xl overflow-hidden border border-black shadow-sm bg-white'>
        <div className='flex'>
          {/* Image */}
          <div className='w-1/3 p-2 border-r-1 border-gray-100 content-center'>
            {_item.type === 'product' && (_item as Product).images.length > 0 ? (
              <img
                className="h-15 w-15 my-auto"
                src={(_item as Product).images[0]}
                alt={_item.name}
              />
            ) : (_item as Charm).image ? (
              <img
                className="h-15 w-15 object-cover"
                src={(_item as Charm).image}
                alt={_item.name}
              />
            ) : (
              <div className="p-1 h-full bg-gray-200 flex items-center justify-center text-gray-400 ">
                <Package className="h-15 w-15" />
              </div>
            )}
          </div>

          {/* Données du produit/charme */}
          <div className='w-2/3 px-1 py-2 space-y-2'>
            <div className='p-1 text-center'>
              <p className='font-bold uppercase'>{_item.name}</p>
              {_item?.categoryName && (<p className="text-xs">{_item?.categoryName}</p>)}
            </div>
            <div className='flex space-between space-x-3 mx-auto my-1 p-1'>
              <div className={`text-center px-3 py-2 rounded-xl text-nowrap`}>
                <p>Stock: {_item.stock}</p>
                <p>Limite: {_item.minStock}</p>
              </div>
              <div className={`flex w-full items-center p-1 rounded-full ${stockStatus.color}`}>
                <p className="mx-auto">{stockStatus.label}</p>
              </div>
              
            </div>
            <div className='text-center'>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingItem(_item);
                  setIsModalOpen(true);
                }}
                icon={Edit}
              >
                Modifier
              </Button>
            </div>
          </div>
          
          
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
        </div>
        <div className='flex space-x-2'>
          <Button 
            onClick={() => handleExport()}
            // disabled={filteredItems.length > 0 ? false : true}
            disabled={true}
            icon={ClipboardPaste}
            color='success'
            size="sm"
          >
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="flex text-xs text-center space-x-2 justify-center">
        {/* Résumé du catalogue */}
        <Card className='p-2 bg-green-300 space-y-2 rounded-2xl gap-2'>
          <h4 className='uppercase'>
            <span className='text-lg'>
              {stats.totalCharms + stats.totalProducts + stats.totalClasps}
            </span> Références</h4>
          <div className='flex gap-2 shadow-lg'>
            <div className='border border-black border-outset p-1 rounded-md'>
              <p className='font-bold text-sm'>{stats.totalProducts}</p>
              <p>Supports</p>
            </div>
            <div className='border border-black border-outset p-1 rounded-md'>
             <p className='font-bold text-sm'>{stats.totalCharms}</p>
              <p>Charmes</p>
            </div>
            <div className='border border-black border-outset p-1 rounded-md'>
              <p className='font-bold text-sm'>{stats.totalClasps}</p>
              <p>Fermoirs</p>
            </div>
          </div>
          
          
        </Card>
        {/* Stocks faibles */}
        <Card className='p-2 bg-orange-400 space-evenly rounded-2xl gap-2 shadow-lg'>
          <TrendingDown className='w-8 h-8 mx-auto' />
          <p className='font-bold text-sm'>{stats.lowStockItems}</p>
          <p>Stock faible</p>
        </Card>

        {/* Ruptures */}
        <Card className='p-2 bg-red-400 space-evenly rounded-2xl gap-2 shadow-lg'>
          <AlertTriangle className='w-8 h-8 mx-auto' />
          <p className='font-bold text-sm'>{stats.outOfStockItems}</p>
          <p>Ruptures</p>
        </Card>
      </div>

      {/* Filtres + Vue Ordinateur/Tablette */}
      <Card className='sticky top-2 left-2 right-2 bg-white'>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit ou une breloque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className='flex flex-1 gap-5'>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'product' | 'charm')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="product">Produits</option>
                <option value="charm">Breloques</option>
                <option value="clasp">Fermoir</option>
              </select>

              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value as 'all' | 'low' | 'out')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les stocks</option>
                <option value="low">Stock faible</option>
                <option value="out">Rupture</option>
              </select>
            </div>
            
          </div>
        </CardHeader>

        <CardContent className="p-0 hidden md:block">
          {/* Vue Tablette/Ordinateur */}
          <div className="overflow-x-auto">
            <table >
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock actuel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock minimum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.type === 'product' && (item as Product).images.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={(item as Product).images[0]}
                                alt={item.name}
                              />
                            ) : (item as Charm).image ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={(item as Charm).image}
                                alt={item.name}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                {item.type === 'product' ? (
                                  <Package className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Sparkles className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.type === 'product' ? (
                            <Package className="h-4 w-4 mr-2 text-blue-500" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                          )}
                          <span className="text-sm text-gray-900 capitalize">
                            {item.type === 'product' ? 'Produit' : 'Breloque'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.categoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-gray-900">
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.minStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          icon={Edit}
                        >
                          Modifier
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Vue Mobile */}
      <div className='md:hidden space-y-2 overflow-y-auto max-h-full'>
      {filteredItems && filteredItems.map((item) => (
        ItemCard(item)
      ))}
      </div>
      

      {/* Modal de modification du stock */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title={`Modifier le stock - ${editingItem?.name}`}
        size="md"
      >
        {editingItem && (
          <StockUpdateForm
            initialData={{
              stock: editingItem.stock,
              minStock: editingItem.minStock
            }}
            onSubmit={handleStockUpdate}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}