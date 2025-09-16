import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/stores/useAuth.stores';
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LogOut } from 'lucide-react';

const Header = () => {
  const user = useAuthStore((state) => state.data);
  const navigate = useNavigate();

  const handleLogOut = () => {
    useAuthStore.getState().setData(null);
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              @Shopping with phamtienanh
            </h1>
          </div>
          {/* Actions */}
          <div>
            {user ? (
              <>
                {/* Nếu đã đăng nhập, hiển thị avatar và tên */}
                <Popover>
                  <PopoverTrigger className = "flex items-center min-w-500 gap-2">
                    <img
                      src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || "User")}
                      alt="avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                  </PopoverTrigger>
                  <PopoverContent align = 'start'>
                    <div className="grid gap-4">
                    <div className="space-y-2 ml-7">
                      <Button variant="ghost" size="icon" onClick={handleLogOut}>
                        <LogOut />Đăng xuất
                      </Button>
                    </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                  <User className="h-5 w-5" />
                  Đăng nhập
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;