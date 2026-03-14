import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/lib/cart-context';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0 mt-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-30" />
              <p className="font-display text-lg">Your cart is empty</p>
              <p className="text-sm mt-1">Add some wellness products!</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-3">
              <div className="space-y-4 pb-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 rounded-lg border p-3 bg-background">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-primary font-semibold mt-1">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-secondary transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-secondary transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-destructive hover:text-destructive/80 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-3 shrink-0">
            <div className="flex justify-between text-lg font-display">
              <span>Total</span>
              <span className="text-primary font-bold">₹{totalPrice.toLocaleString()}</span>
            </div>
            <Button className="w-full" size="lg" onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>Proceed to Checkout</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
