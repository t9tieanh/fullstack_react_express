interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  description?: string;
}

const Info = ({ product }: { product: Product }) => {
    return (
        <>
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col items-center">
                <img src={product.image} alt={product.name} className="w-64 h-64 object-contain mb-4" />
                </div>
                <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-2">★ {product.rating}</span>
                    <span className="text-gray-500">({product.sold} đã bán)</span>
                </div>
                <div className="mb-2">
                    {product.originalPrice && (
                    <span className="line-through text-gray-400 mr-2">{product.originalPrice.toLocaleString()}₫</span>
                    )}
                    <span className="text-orange-600 text-xl font-bold">{product.price.toLocaleString()}₫</span>
                </div>
                <div className="mb-2">
                    <input type="number" min={1} defaultValue={1} className="border px-2 py-1 w-24" placeholder="Số lượng" />
                </div>
                <div className="mt-4">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Thêm vào sản phẩm yêu thích</button>
                </div>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="font-bold text-lg mb-2">Thông tin chi tiết về Sản phẩm</h2>
                <p>{product.description || "Đang cập nhật..."}</p>
            </div>
            </div>
        </>
    )
}

export default Info;