import Product from "../models/Product";
import { connectDB } from "../config/db";
import 'dotenv/config';
async function seed() {
   await connectDB();
  const sampleProducts = Array.from({ length: 15 }).map((_, i) => {
    const basePrice = Math.floor(Math.random() * 2000000) + 100000;
    const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 40) + 10 : undefined;
    const originalPrice = discount ? basePrice + (basePrice * discount) / 100 : undefined;

    return {
      name: `Sản phẩm demo ${i + 1} - Hàng chính hãng`,
      price: basePrice,
      originalPrice,
      image: `https://picsum.photos/300/300?random=${i + 1}`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      sold: Math.floor(Math.random() * 1000),
      discount
    };
  });

//   await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log("🌱 Seeded 15 sample products");
  process.exit();
}

seed();
