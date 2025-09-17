import { useState, useEffect, useCallback } from "react";
import ProductCard from "../common/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  discount?: number;
}

const ProductGrid = ({ minPrice, minStart }: { minPrice?: number; minStart?: number }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/products?page=${pageNum}&limit=15&minPrice=${minPrice}&minStart=${minStart}`
      );
      const data = await res.json();

      // Thêm delay 2 giây
      await new Promise(res => setTimeout(res, 1000));

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
  }, [minPrice, minStart]);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const loadMore = () => {
    console.log("load more");
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage);
    }
  };

  return (
    <div className="space-y-6">
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<Loader2 className="h-6 my-5 w-6 mx-auto animate-spin text-primary" />}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} {...product} id={product._id} />
            ))}
          </div>
        </InfiniteScroll>

      {!hasMore && (
        <div className="text-center py-8 text-muted-foreground">
          Đã hiển thị tất cả sản phẩm
        </div>
      )}
    </div>
  );
};

export default ProductGrid;