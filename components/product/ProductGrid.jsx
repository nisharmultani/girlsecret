import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading = false, columns = 'default' }) {
  // Define grid column classes based on columns prop
  const gridClasses = {
    default: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    three: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3',
    four: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4',
  };

  const selectedGrid = gridClasses[columns] || gridClasses.default;

  if (loading) {
    return (
      <div className={`grid ${selectedGrid} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10`}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-5 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${selectedGrid} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
