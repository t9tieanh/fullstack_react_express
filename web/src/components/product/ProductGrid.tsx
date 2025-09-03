import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  discount?: number;
}


const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/products?page=${pageNum}&limit=15`
      );
      const data = await res.json();

      if (pageNum === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }

      setHasMore(data.hasMore);
    } catch (err) {
      console.error("❌ Lỗi khi load sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center py-8">
          <Button 
            onClick={loadMore}
            variant="outline"
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            Xem thêm sản phẩm
          </Button>
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-8 text-muted-foreground">
          Đã hiển thị tất cả sản phẩm
        </div>
      )}
    </div>
  );
};

export default ProductGrid;