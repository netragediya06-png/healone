import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShoppingBag, Truck, CreditCard, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', payment: 'cod',
  });

  const shipping = totalPrice > 500 ? 0 : 50;
  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    const id = `HO${Date.now().toString().slice(-8)}`;
    setOrderId(id);
    setOrderPlaced(true);
    clearCart();
    toast.success('Order placed successfully!');
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-20 w-20 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
          <Link to="/products"><Button size="lg">Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">Order Placed!</h2>
          <p className="text-muted-foreground mb-2">Thank you for your order. Your wellness products are on the way!</p>
          <p className="text-sm text-muted-foreground mb-8">Order ID: #{orderId}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/"><Button variant="outline">Go Home</Button></Link>
            <Link to="/products"><Button>Continue Shopping</Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        <div className="flex items-center gap-2 mb-10">
          {[{ n: 1, label: 'Address', icon: MapPin }, { n: 2, label: 'Payment', icon: CreditCard }, { n: 3, label: 'Review', icon: CheckCircle }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => step > s.n && setStep(s.n)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                <s.icon className="h-4 w-4" /> {s.label}
              </button>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > s.n ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-card rounded-2xl border p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" className="col-span-2 sm:col-span-1 px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <input name="email" value={form.email} onChange={handleChange} placeholder="Email *" type="email" className="px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" className="px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Full Address *" className="col-span-2 px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <input name="city" value={form.city} onChange={handleChange} placeholder="City *" className="px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="PIN Code *" className="px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <Button className="w-full sm:w-auto mt-4" onClick={() => setStep(2)}>Continue to Payment</Button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-card rounded-2xl border p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'upi', label: 'UPI Payment', desc: 'GPay, PhonePe, Paytm, etc.' },
                    { value: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { value: 'netbanking', label: 'Net Banking', desc: 'All major banks supported' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form.payment === opt.value ? 'border-primary bg-primary/5' : 'hover:bg-secondary'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={handleChange} className="accent-primary" />
                      <div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)}>Review Order</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-card rounded-2xl border p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Review Order</h2>
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {form.name}</p>
                  <p><span className="font-medium">Email:</span> {form.email}</p>
                  <p><span className="font-medium">Phone:</span> {form.phone}</p>
                  <p><span className="font-medium">Address:</span> {form.address}, {form.city}, {form.state} - {form.pincode}</p>
                  <p><span className="font-medium">Payment:</span> {form.payment === 'cod' ? 'Cash on Delivery' : form.payment === 'upi' ? 'UPI' : form.payment === 'card' ? 'Card' : 'Net Banking'}</p>
                </div>
                <div className="space-y-3 mt-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1" size="lg" onClick={handlePlaceOrder}>Place Order — ₹{grandTotal.toLocaleString()}</Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border p-6 sticky top-24">
              <h3 className="font-display font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({totalItems} items)</span><span>₹{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-primary font-medium">FREE</span> : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (5%)</span><span>₹{tax}</span></div>
                <div className="border-t pt-3 flex justify-between text-lg font-display font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              {shipping === 0 && (
                <div className="mt-4 bg-primary/10 rounded-lg p-3 flex items-center gap-2 text-xs text-primary">
                  <Truck className="h-4 w-4 shrink-0" /> Free shipping on orders above ₹500!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
