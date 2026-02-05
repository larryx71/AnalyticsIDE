// Mock priority tasks derived from analytics signals

export type TaskType = "error" | "performance" | "feature" | "optimization";
export type TaskSeverity = "critical" | "high" | "medium" | "low";

export interface PriorityTask {
  id: string;
  type: TaskType;
  severity: TaskSeverity;
  title: string;
  description: string;
  file: string;
  filePath: string;
  lineRange: [number, number];
  affectedUsers: number;
  weeklyImpact: number; // estimated revenue/conversion impact
  detectedAt: string;
  aiFixAvailable: boolean;
  suggestedFix?: {
    summary: string;
    oldCode: string;
    newCode: string;
  };
  relatedEvents: string[];
  metrics: {
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
  }[];
}

export const priorityTasks: PriorityTask[] = [
  {
    id: "task-1",
    type: "error",
    severity: "critical",
    title: "High error rate in checkout validation",
    description:
      "Phone number validation is failing for 15.2% of users at the shipping step. The regex pattern doesn't account for international formats or phone numbers with dashes/spaces.",
    file: "CheckoutFlow.tsx",
    filePath: "src/components/CheckoutFlow.tsx",
    lineRange: [45, 52],
    affectedUsers: 2341,
    weeklyImpact: 45000,
    detectedAt: "2024-01-15T10:23:00Z",
    aiFixAvailable: true,
    suggestedFix: {
      summary: "Update phone validation to accept international formats",
      oldCode: `  const validateShipping = (data: FormData) => {
    const newErrors: string[] = [];
    
    if (!data.address) newErrors.push('Address is required');
    if (!data.city) newErrors.push('City is required');
    if (!data.zipCode) newErrors.push('ZIP code is required');
    // BUG: Missing phone validation causing 15% error rate
    if (data.phone && !/^\\d{10}$/.test(data.phone)) {
      newErrors.push('Invalid phone format');
    }
    
    return newErrors;
  };`,
      newCode: `  const validateShipping = (data: FormData) => {
    const newErrors: string[] = [];
    
    if (!data.address) newErrors.push('Address is required');
    if (!data.city) newErrors.push('City is required');
    if (!data.zipCode) newErrors.push('ZIP code is required');
    // Fixed: Accept international formats, dashes, spaces, and parentheses
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]{6,14}$/;
    if (data.phone && !phoneRegex.test(data.phone.trim())) {
      newErrors.push('Invalid phone format');
    }
    
    return newErrors;
  };`,
    },
    relatedEvents: ["checkout_error", "checkout_started"],
    metrics: [
      { label: "Error Rate", value: "15.2%", trend: "up" },
      { label: "Affected Users", value: "2,341", trend: "up" },
      { label: "Est. Lost Revenue", value: "$45K/week", trend: "up" },
    ],
  },
  {
    id: "task-2",
    type: "error",
    severity: "high",
    title: "Payment failures increasing rapidly",
    description:
      "Card validation errors increased 22% this week. The regex requires exactly 16 digits but doesn't handle Amex (15 digits) or spaces in card input.",
    file: "CheckoutFlow.tsx",
    filePath: "src/components/CheckoutFlow.tsx",
    lineRange: [54, 65],
    affectedUsers: 169,
    weeklyImpact: 28000,
    detectedAt: "2024-01-14T15:45:00Z",
    aiFixAvailable: true,
    suggestedFix: {
      summary: "Support multiple card formats including Amex",
      oldCode: `  const validatePayment = (data: FormData) => {
    const newErrors: string[] = [];
    
    if (!data.cardNumber) newErrors.push('Card number is required');
    // BUG: Card validation regex is incorrect
    if (data.cardNumber && !/^\\d{16}$/.test(data.cardNumber.replace(/\\s/g, ''))) {
      newErrors.push('Invalid card number');
    }
    if (!data.expiry) newErrors.push('Expiry date is required');
    if (!data.cvv) newErrors.push('CVV is required');
    
    return newErrors;
  };`,
      newCode: `  const validatePayment = (data: FormData) => {
    const newErrors: string[] = [];
    
    if (!data.cardNumber) newErrors.push('Card number is required');
    // Fixed: Support Visa/MC (16), Amex (15), and allow spaces/dashes
    const cleanCardNumber = data.cardNumber?.replace(/[\\s-]/g, '') || '';
    if (cleanCardNumber && !/^\\d{15,16}$/.test(cleanCardNumber)) {
      newErrors.push('Invalid card number');
    }
    if (!data.expiry) newErrors.push('Expiry date is required');
    if (!data.cvv) newErrors.push('CVV is required');
    
    return newErrors;
  };`,
    },
    relatedEvents: ["payment_failed", "payment_submitted"],
    metrics: [
      { label: "Failure Rate", value: "7.8%", trend: "up" },
      { label: "Weekly Change", value: "+22%", trend: "up" },
      { label: "Est. Lost Revenue", value: "$28K/week", trend: "up" },
    ],
  },
  {
    id: "task-3",
    type: "optimization",
    severity: "medium",
    title: "Low add-to-cart conversion on mobile",
    description:
      "Mobile users have 23% lower add-to-cart rates. The button may be too small on touch devices or competing with other tap targets.",
    file: "ProductCard.tsx",
    filePath: "src/components/ProductCard.tsx",
    lineRange: [50, 65],
    affectedUsers: 8932,
    weeklyImpact: 15000,
    detectedAt: "2024-01-13T09:12:00Z",
    aiFixAvailable: true,
    suggestedFix: {
      summary: "Increase touch target size and improve mobile layout",
      oldCode: `      <div className="product-actions">
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleWishlist}>♡</button>
      </div>`,
      newCode: `      <div className="product-actions flex flex-col sm:flex-row gap-2">
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          className="w-16 h-12 text-center text-lg"
        />
        <button 
          onClick={handleAddToCart}
          className="min-h-[48px] px-6 text-lg font-medium touch-manipulation"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleWishlist}
          className="min-h-[48px] min-w-[48px] text-xl touch-manipulation"
        >
          ♡
        </button>
      </div>`,
    },
    relatedEvents: ["add_to_cart_clicked", "product_viewed"],
    metrics: [
      { label: "Mobile Conversion", value: "19.8%", trend: "stable" },
      { label: "Desktop Conversion", value: "25.8%", trend: "up" },
      { label: "Gap", value: "-23%", trend: "stable" },
    ],
  },
  {
    id: "task-4",
    type: "feature",
    severity: "medium",
    title: "Profile update failures on mobile",
    description:
      "25.4% of profile edit attempts fail on mobile devices. Consider adding better form validation feedback and auto-save functionality.",
    file: "UserProfile.tsx",
    filePath: "src/components/UserProfile.tsx",
    lineRange: [37, 52],
    affectedUsers: 144,
    weeklyImpact: 5000,
    detectedAt: "2024-01-12T14:30:00Z",
    aiFixAvailable: true,
    suggestedFix: {
      summary: "Add real-time validation and auto-save for better mobile UX",
      oldCode: `  const handleSaveProfile = async (updatedData: Partial<User>) => {
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
  };`,
      newCode: `  const handleSaveProfile = async (updatedData: Partial<User>) => {
    // Validate before submission
    const validationErrors = validateProfileData(updatedData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateUser(userId, updatedData);
      
      analytics.track('profile_updated', {
        user_id: userId,
        fields_updated: Object.keys(updatedData),
      });

      setIsEditing(false);
      showToast('Profile updated successfully');
    } catch (error) {
      analytics.track('profile_update_failed', {
        user_id: userId,
        error: error.message,
      });
      setErrors(['Failed to save changes. Please try again.']);
    }
  };`,
    },
    relatedEvents: ["profile_updated", "profile_update_failed"],
    metrics: [
      { label: "Mobile Failure Rate", value: "25.4%", trend: "up" },
      { label: "Desktop Failure Rate", value: "8.2%", trend: "stable" },
      { label: "Retry Rate", value: "67%", trend: "stable" },
    ],
  },
  {
    id: "task-5",
    type: "performance",
    severity: "low",
    title: "Wishlist feature underutilized",
    description:
      "Wishlist usage declined 3.2% this week. Users may not be discovering the feature. Consider adding onboarding tooltip or moving the button placement.",
    file: "ProductCard.tsx",
    filePath: "src/components/ProductCard.tsx",
    lineRange: [36, 42],
    affectedUsers: 2857,
    weeklyImpact: 3000,
    detectedAt: "2024-01-11T11:00:00Z",
    aiFixAvailable: false,
    relatedEvents: ["wishlist_toggled", "product_viewed"],
    metrics: [
      { label: "Usage Rate", value: "22.9%", trend: "down" },
      { label: "Weekly Change", value: "-3.2%", trend: "down" },
      { label: "Convert to Purchase", value: "12%", trend: "stable" },
    ],
  },
];

export function getTasksByFile(fileName: string): PriorityTask[] {
  return priorityTasks.filter((task) => task.file === fileName);
}

export function getTasksBySeverity(severity: TaskSeverity): PriorityTask[] {
  return priorityTasks.filter((task) => task.severity === severity);
}
