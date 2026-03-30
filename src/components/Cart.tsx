'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import styles from '@/app/page.module.css';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      <div 
        className={`${styles.cartOverlay} ${isCartOpen ? styles.open : ''}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`${styles.cartPanel} ${isCartOpen ? styles.open : ''}`}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Shopping Cart</h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            &times;
          </button>
        </div>
        
        <div className={styles.cartItems}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                {item.image && (
                  <img src={item.image} alt={item.name} className={styles.cartItemImage} />
                )}
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemName}>{item.name}</div>
                  <div className={styles.cartItemPrice}>KSh {item.price.toFixed(2)}</div>
                  <div className={styles.cartItemQuantity}>
                    <button 
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)}>&times;</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span>Total</span>
              <span className={styles.cartTotalAmount}>KSh {total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
