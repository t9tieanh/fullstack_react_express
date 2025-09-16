/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { useState } from "react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const Sidebar = (
  { minPrice, setMinPrice, minStart, setMinStart }: { 
    minPrice?: number; 
    setMinPrice?: (value: number) => void;
    minStart?: number;
    setMinStart?: (value: number) => void;
  }) => {

  const debouncePriceRef = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState(false)

  const [ productSearch, setProductSearch ] = useState(null)

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(
        `http://localhost:4000/api/products/search?name=${value}`
      );
      const data = await res.json();
      if (data.result && data.code === 200) {
        setProductSearch(data.result);
      }
    }, 400); // 400ms delay
  };

  const handleMinPriceChange = (value: number) => {
    if (debouncePriceRef.current) clearTimeout(debouncePriceRef.current);
    debouncePriceRef.current = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      setMinPrice && setMinPrice(value);
    }, 400); // 400ms delay
  };

  return (
    <div className="space-y-6">
      <Popover open={open}>
        <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        >
          <PopoverTrigger >
          <div
            className='flex w-full gap-3 items-center border-0 justify-between'
          >
            <Input
              onChange={handleSearchInputChange}
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 bg-muted/50 border-0 focus:bg-background transition-colors"
            />
            <Search />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80"
          align="start"
        >
          { productSearch ? (
            <div className="max-h-96 overflow-y-auto"
              style={{
                scrollbarWidth: "none",        // Firefox
                msOverflowStyle: "none",       // IE 10+
              }}    
            >
              { productSearch.length > 0 ? productSearch.map((product: any) => (
                <div key={product.id} className="flex items-center gap-2 p-2 border-b border-muted">
                  <Avatar>
                    <AvatarImage src={product.image} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {product.name}
                </div>
              )) : (
                <div className="p-2 text-muted-foreground">Không tìm thấy sản phẩm nào.</div>
              )}
            </div>
          ) : <div className="p-2 text-muted-foreground">Bắt đầu search cùng ElasticSearch.</div>}
        </PopoverContent>

        </div>
      </Popover>

      {/* Price Filter */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Khoảng giá</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0]}
            max={5000000}
            step={100000}
            className="w-full"
            onValueChange={value => handleMinPriceChange(value[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{minPrice}đ</span>
            <span>5.000.000đ</span>
          </div>
        </div>
      </Card>

      {/* Rating Filter */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Đánh giá</h3>
        <div className="space-y-3">
          <RadioGroup defaultValue="1" onValueChange={value => setMinStart && setMinStart(Number(value))}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(rating)} id={`rating-${rating}`} />
                  <label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 text-sm cursor-pointer">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < rating ? "fill-rating text-rating" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span>trở lên</span>
                  </label>
                </div>
              ))}
            </RadioGroup>
        </div>
      </Card>
    </div>
  );
};

export default Sidebar;