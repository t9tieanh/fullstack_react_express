import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ProductGrid from "@/components/product/ProductGrid";
import { useState } from "react";

const Index = () => {
  // filter 
  const [minPrice, setMinPrice] = useState<number>(0);
  const [minStart, setMinStart] = useState<number>(0);

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
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar 
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                minStart={minStart}
                setMinStart={setMinStart}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Sản phẩm nổi bật</h2>
            </div>
            <ProductGrid 
                minPrice={minPrice}
                minStart={minStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
