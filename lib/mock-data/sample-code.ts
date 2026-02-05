// Sample code files that will be displayed in the editor

export interface SampleFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const sampleFiles: SampleFile[] = [
  {
    name: "ProductCard.tsx",
    path: "src/components/ProductCard.tsx",
    language: "typescript",
    content: `import { useState } from 'react';
import { analytics } from '@/lib/analytics';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export function ProductCard({ id, name, price, image, rating }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Track product view when component mounts
  analytics.track('product_viewed', {
    product_id: id,
    product_name: name,
    price: price,
  });

  const handleAddToCart = () => {
    analytics.track('add_to_cart_clicked', {
      product_id: id,
      product_name: name,
      quantity: quantity,
      price: price * quantity,
    });
    
    // Add to cart logic
    console.log(\`Added \${quantity} of \${name} to cart\`);
  };

  const handleWishlist = () => {
    analytics.track('wishlist_toggled', {
      product_id: id,
      action: 'add',
    });
  };

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <h3>{name}</h3>
        <div className="rating">{'★'.repeat(rating)}</div>
        <p className="price">\${price.toFixed(2)}</p>
      </div>
      <div className="product-actions">
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleWishlist}>♡</button>
      </div>
    </div>
  );
}`,
  },
  {
    name: "CheckoutFlow.tsx",
    path: "src/components/CheckoutFlow.tsx",
    language: "typescript",
    content: `import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface CheckoutStep {
  id: string;
  title: string;
  completed: boolean;
}

interface CheckoutFlowProps {
  cartItems: CartItem[];
  onComplete: (orderId: string) => void;
}

export function CheckoutFlow({ cartItems, onComplete }: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps: CheckoutStep[] = [
    { id: 'shipping', title: 'Shipping Address', completed: false },
    { id: 'payment', title: 'Payment Method', completed: false },
    { id: 'review', title: 'Review Order', completed: false },
  ];

  useEffect(() => {
    analytics.track('checkout_started', {
      cart_value: calculateTotal(cartItems),
      item_count: cartItems.length,
    });
  }, []);

  const validateShipping = (data: FormData) => {
    const newErrors: string[] = [];
    
    if (!data.address) newErrors.push('Address is required');
    if (!data.city) newErrors.push('City is required');
    if (!data.zipCode) newErrors.push('ZIP code is required');
    // BUG: Missing phone validation causing 15% error rate
    if (data.phone && !/^\\d{10}$/.test(data.phone)) {
      newErrors.push('Invalid phone format');
    }
    
    return newErrors;
  };

  const validatePayment = (data: FormData) => {
    const newErrors: string[] = [];
    
    if (!data.cardNumber) newErrors.push('Card number is required');
    // BUG: Card validation regex is incorrect
    if (data.cardNumber && !/^\\d{16}$/.test(data.cardNumber.replace(/\\s/g, ''))) {
      newErrors.push('Invalid card number');
    }
    if (!data.expiry) newErrors.push('Expiry date is required');
    if (!data.cvv) newErrors.push('CVV is required');
    
    return newErrors;
  };

  const handleNext = async () => {
    let validationErrors: string[] = [];
    
    if (currentStep === 0) {
      validationErrors = validateShipping(formData);
    } else if (currentStep === 1) {
      validationErrors = validatePayment(formData);
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      analytics.track('checkout_error', {
        step: steps[currentStep].id,
        errors: validationErrors,
        error_count: validationErrors.length,
      });
      return;
    }

    analytics.track('checkout_step_completed', {
      step: steps[currentStep].id,
      step_number: currentStep + 1,
    });

    if (currentStep === steps.length - 1) {
      await processOrder();
    } else {
      setCurrentStep(currentStep + 1);
      setErrors([]);
    }
  };

  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      analytics.track('payment_submitted', {
        cart_value: calculateTotal(cartItems),
        payment_method: formData.paymentMethod || 'card',
      });

      // Simulate API call
      const orderId = await submitOrder(formData, cartItems);
      
      analytics.track('order_completed', {
        order_id: orderId,
        total: calculateTotal(cartItems),
        item_count: cartItems.length,
      });

      onComplete(orderId);
    } catch (error) {
      analytics.track('payment_failed', {
        error: error.message,
        cart_value: calculateTotal(cartItems),
      });
      setErrors(['Payment processing failed. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-flow">
      <div className="steps-indicator">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={\`step \${index === currentStep ? 'active' : ''}\`}
          >
            {step.title}
          </div>
        ))}
      </div>
      
      <form className="checkout-form">
        {errors.length > 0 && (
          <div className="error-list">
            {errors.map((error, i) => <p key={i}>{error}</p>)}
          </div>
        )}
        
        {/* Form fields based on current step */}
        <div className="form-content">
          {currentStep === 0 && <ShippingForm data={formData} onChange={setFormData} />}
          {currentStep === 1 && <PaymentForm data={formData} onChange={setFormData} />}
          {currentStep === 2 && <OrderReview items={cartItems} data={formData} />}
        </div>
        
        <button 
          type="button" 
          onClick={handleNext}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : currentStep === steps.length - 1 ? 'Place Order' : 'Continue'}
        </button>
      </form>
    </div>
  );
}`,
  },
  {
    name: "UserProfile.tsx",
    path: "src/components/UserProfile.tsx",
    language: "typescript",
    content: `import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    analytics.track('profile_viewed', {
      user_id: userId,
      source: 'navigation',
    });

    fetchUserData(userId);
  }, [userId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    analytics.track('profile_tab_changed', {
      from_tab: activeTab,
      to_tab: tab,
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    analytics.track('profile_edit_started', {
      user_id: userId,
    });
  };

  const handleSaveProfile = async (updatedData: Partial<User>) => {
    try {
      await updateUser(userId, updatedData);
      
      analytics.track('profile_updated', {
        user_id: userId,
        fields_updated: Object.keys(updatedData),
      });

      setIsEditing(false);
    } catch (error) {
      analytics.track('profile_update_failed', {
        user_id: userId,
        error: error.message,
      });
    }
  };

  const handleNotificationToggle = (type: string, enabled: boolean) => {
    analytics.track('notification_preference_changed', {
      notification_type: type,
      enabled: enabled,
    });
  };

  const handleAccountDeletion = () => {
    analytics.track('account_deletion_initiated', {
      user_id: userId,
    });
    
    // Show confirmation modal
  };

  return (
    <div className="user-profile">
      <header className="profile-header">
        <img src={user?.avatar} alt={user?.name} className="avatar" />
        <div className="user-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <button onClick={handleEditProfile}>Edit Profile</button>
      </header>

      <nav className="profile-tabs">
        {['overview', 'orders', 'settings', 'security'].map(tab => (
          <button
            key={tab}
            className={\`tab \${activeTab === tab ? 'active' : ''}\`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="profile-content">
        {activeTab === 'overview' && <OverviewTab user={user} />}
        {activeTab === 'orders' && <OrdersTab userId={userId} />}
        {activeTab === 'settings' && (
          <SettingsTab 
            user={user}
            onNotificationChange={handleNotificationToggle}
          />
        )}
        {activeTab === 'security' && (
          <SecurityTab 
            userId={userId}
            onDeleteAccount={handleAccountDeletion}
          />
        )}
      </main>
    </div>
  );
}`,
  },
];

export function getSampleFile(name: string): SampleFile | undefined {
  return sampleFiles.find((f) => f.name === name);
}
