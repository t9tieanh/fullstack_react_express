import { useState, useEffect, useCallback } from "react";
import ProductCard from "../common/ProductCard";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuth.stores";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

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
  const { data } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data) {
        toast({ title: "Vui lòng đăng nhập để xem danh sách yêu thích", variant: "destructive" });
        navigate('/');
        return;
    }
    loadProducts();
  }, [data]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/products/favorites`, {
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json"
            }
        }
      );
      const response = await res.json();
      setProducts(response.result || []);
    } catch (err) {
      console.error("❌ Lỗi khi load sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
            <ProductCard key={product.id} {...product} />
        ))}
        {
            !products || products.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-10">
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mb-2" />
                            <p>Đang tải sản phẩm...</p>
                        </>
                    ) : (
                        <p>Không có sản phẩm nào.</p>
                    )}
                </div>
            ) : null 
        }
        </div>
    </div>
  );
};

export default ProductGrid;