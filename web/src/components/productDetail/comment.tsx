import { useEffect, useState } from "react";


export interface Comment {
  user: { name: string };
  content: string;
  rating: number;
  createdAt: string;
}

interface Props {
  productId: string;
}

const CommentSlider = ({ comments }: { comments?: Comment[] }) => {
  return (
    <div className="my-8">
      <h2 className="font-bold text-lg mb-4">Nhận xét từ khách hàng</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {comments?.map((c, idx) => (
          <div
            key={idx}
            className="min-w-[300px] max-w-xs bg-gray-400 text-white rounded-lg p-6 flex-shrink-0 shadow relative"
          >
            <div className="absolute top-4 left-4 text-2xl opacity-60">“</div>
            <div className="mb-4 mt-2 min-h-[60px]">{c.content}</div>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-green-900 font-bold">
                {c?.user?.name[0]}
              </div>
              <div>
                <div className="font-semibold">{c.user.name}</div>
                <div className="text-yellow-300 text-sm">
                  {"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}
                </div>
                <div className="text-xs text-white/80">{new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
        { !comments || comments?.length === 0 && <div>Chưa có nhận xét nào.</div>}
      </div>
    </div>
  );
};

export default CommentSlider;