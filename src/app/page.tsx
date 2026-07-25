'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/storefront/HeroSection';
import { MenuBrowser } from '@/components/storefront/MenuBrowser';
import { CartDrawer, CartItem } from '@/components/storefront/CartDrawer';
import { OrderTrackerModal } from '@/components/storefront/OrderTrackerModal';
import { ReservationModal } from '@/components/storefront/ReservationModal';
import { ReviewSubmissionModal } from '@/components/storefront/ReviewSubmissionModal';
import { Footer } from '@/components/layout/Footer';
import { MenuItem, Review, Order } from '@/lib/types';
import { Star, MapPin, Phone, Clock, MessageSquarePlus, Award, ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

export default function StorefrontPage() {
  const { showToast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Cart & Drawers State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    fetchStorefrontData();
  }, []);

  const fetchStorefrontData = async () => {
    setIsLoadingMenu(true);
    try {
      const [menuRes, reviewsRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/reviews')
      ]);

      if (menuRes.ok) setMenuItems(await menuRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
    } catch (e) {
      showToast('Error loading cafe menu', 'error');
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const handleAddToCart = (item: MenuItem, addons: string[], notes: string) => {
    const extraPrice = addons.reduce((sum, name) => {
      const found = item.addons?.find((a) => a.name === name);
      return sum + (found ? found.price : 0);
    }, 0);

    const cartItemId = `${item.id}-${addons.sort().join('-')}-${notes}`;

    const existingIndex = cartItems.findIndex((ci) => ci.id === cartItemId);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: cartItemId,
          menuItemId: item.id,
          name: item.name,
          unitPrice: item.price + extraPrice,
          quantity: 1,
          addons,
          notes,
          image: item.image
        }
      ]);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenReservations={() => setIsReservationOpen(true)}
          onOpenTracker={() => setIsTrackerOpen(true)}
        />

        {/* Hero Section */}
        <HeroSection
          onBrowseMenu={scrollToMenu}
          onBookTable={() => setIsReservationOpen(true)}
        />

        {/* Menu Browser */}
        <MenuBrowser
          items={menuItems}
          isLoading={isLoadingMenu}
          onAddToCart={handleAddToCart}
        />

        {/* Customer Reviews Section */}
        <section className="bg-slate-900/60 border-y border-slate-800/80 py-16 my-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>Pasrur Community Feedback</span>
                </div>
                <h2 className="text-3xl font-black text-white">What Foodies Say About Iffi Cafe</h2>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-600/20 active:scale-95 flex items-center gap-2 shrink-0"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Leave a Review</span>
              </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Verified Order
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &quot;{rev.reviewText}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900">
                    <h4 className="font-bold text-white text-xs">{rev.customerName}</h4>
                    {rev.favoriteItem && (
                      <p className="text-[10px] text-amber-400 font-medium">
                        Loves: {rev.favoriteItem}
                      </p>
                    )}
                    {rev.replyText && (
                      <p className="text-[11px] text-slate-400 mt-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <strong className="text-amber-400">Iffi Cafe:</strong> &quot;{rev.replyText}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location & Info Card Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Visit Us in Pasrur
                </span>
                <h3 className="text-3xl font-black text-white">Experience Cozy Cafe Vibes</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Located right on the main Pasrur-Sialkot Road near Govt College Pasrur. Bring family and friends to enjoy our air-conditioned family section, VIP lounge, or outdoor terrace.
                </p>

                <div className="space-y-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Main Pasrur-Sialkot Road, Near Govt College, Pasrur 51480, Punjab</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>+92 327 7552400 (Takeaway / Delivery / Direct Call)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>12:00 PM – 2:00 AM (Open Late Night)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center">
                <Award className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Pasrur Delivery Guarantee</h4>
                <p className="text-xs text-slate-400">
                  Hot, crispy, and fresh food delivered right to your doorstep anywhere in Pasrur tehsil within 30-40 minutes!
                </p>
                <button
                  onClick={scrollToMenu}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/30"
                >
                  Order Food Delivery Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={() => setCartItems([])}
          onOrderPlaced={(order) => {
            fetchStorefrontData();
          }}
        />
      )}

      {/* Order Tracker Modal */}
      {isTrackerOpen && (
        <OrderTrackerModal
          isOpen={isTrackerOpen}
          onClose={() => setIsTrackerOpen(false)}
        />
      )}

      {/* Reservation Modal */}
      {isReservationOpen && (
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
        />
      )}

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <ReviewSubmissionModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewSubmitted={() => fetchStorefrontData()}
        />
      )}
    </div>
  );
}
