import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Info from "@/components/productDetail/info";
import Header from "@/components/layout/Header";
import CommentSlider, { Comment } from "@/components/productDetail/comment";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  discount?: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
  comments?: Comment[];
}

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) return;
    fetch(`http://localhost:4000/api/products/${productId}`)
      .then(res => res.json())
      .then(data => setProduct(data.result))
      .catch(() => toast({ title: "Không tìm thấy sản phẩm", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <div className="bg-gradient-hero border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Mua sắm thần tốc, săn giá hời mỗi ngày 
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Giảm giá lên đến 50% cho tất cả sản phẩm. Miễn phí vận chuyển toàn quốc!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex-col gap-6">

          {/* Products */}
          <div className="flex-1">
            <Info product={product} />
          </div>
          {/* comment */}
          <div className="flex-1">
            <CommentSlider comments={product.comments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;