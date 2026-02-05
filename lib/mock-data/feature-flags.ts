// Mock feature flag data for each file

export type FlagStatus = "active" | "inactive" | "rolled_out" | "stale";

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  status: FlagStatus;
  rolloutPercentage: number;
  description: string;
  lineReferences: number[]; // lines in code where flag is used
  createdAt: string;
  lastModified: string;
  owner: string;
}

export interface FileFeatureFlags {
  fileName: string;
  flags: FeatureFlag[];
}

export const fileFeatureFlags: Record<string, FileFeatureFlags> = {
  "ProductCard.tsx": {
    fileName: "ProductCard.tsx",
    flags: [
      {
        id: "flag-1",
        name: "Wishlist V2",
        key: "show_wishlist_v2",
        status: "active",
        rolloutPercentage: 100,
        description: "Enable the new wishlist design with animations",
        lineReferences: [36, 37, 38],
        createdAt: "2024-01-10T10:00:00Z",
        lastModified: "2024-01-15T14:30:00Z",
        owner: "sarah.chen",
      },
      {
        id: "flag-2",
        name: "Quick Add to Cart",
        key: "enable_quick_add",
        status: "active",
        rolloutPercentage: 75,
        description: "Show quick add button on hover without opening modal",
        lineReferences: [24, 28],
        createdAt: "2024-01-05T09:00:00Z",
        lastModified: "2024-01-18T11:20:00Z",
        owner: "mike.johnson",
      },
      {
        id: "flag-3",
        name: "Legacy Rating Stars",
        key: "use_legacy_ratings",
        status: "stale",
        rolloutPercentage: 0,
        description: "Use old star rating component - scheduled for removal",
        lineReferences: [15, 16],
        createdAt: "2023-06-01T10:00:00Z",
        lastModified: "2023-08-15T10:00:00Z",
        owner: "legacy-team",
      },
    ],
  },
  "CheckoutFlow.tsx": {
    fileName: "CheckoutFlow.tsx",
    flags: [
      {
        id: "flag-4",
        name: "Express Checkout",
        key: "enable_express_pay",
        status: "active",
        rolloutPercentage: 50,
        description: "Enable one-click checkout for returning customers",
        lineReferences: [93, 94, 95],
        createdAt: "2024-01-08T15:00:00Z",
        lastModified: "2024-01-20T09:45:00Z",
        owner: "payments-team",
      },
      {
        id: "flag-5",
        name: "New Validation Flow",
        key: "new_checkout_validation",
        status: "rolled_out",
        rolloutPercentage: 100,
        description: "Use the new form validation logic - fully rolled out",
        lineReferences: [45, 54, 70],
        createdAt: "2023-11-15T10:00:00Z",
        lastModified: "2024-01-01T10:00:00Z",
        owner: "checkout-team",
      },
      {
        id: "flag-6",
        name: "Guest Checkout",
        key: "allow_guest_checkout",
        status: "inactive",
        rolloutPercentage: 0,
        description: "Allow checkout without account creation",
        lineReferences: [28, 29],
        createdAt: "2024-01-12T14:00:00Z",
        lastModified: "2024-01-12T14:00:00Z",
        owner: "growth-team",
      },
      {
        id: "flag-7",
        name: "Old Payment Form",
        key: "legacy_payment_ui",
        status: "stale",
        rolloutPercentage: 0,
        description: "Legacy payment form - no longer in use",
        lineReferences: [108, 109, 110],
        createdAt: "2022-03-01T10:00:00Z",
        lastModified: "2023-01-15T10:00:00Z",
        owner: "legacy-team",
      },
    ],
  },
  "UserProfile.tsx": {
    fileName: "UserProfile.tsx",
    flags: [
      {
        id: "flag-8",
        name: "Profile Tabs V2",
        key: "new_profile_tabs",
        status: "active",
        rolloutPercentage: 100,
        description: "Use the redesigned profile tab navigation",
        lineReferences: [25, 26, 27],
        createdAt: "2024-01-02T10:00:00Z",
        lastModified: "2024-01-16T16:00:00Z",
        owner: "user-experience",
      },
      {
        id: "flag-9",
        name: "Account Deletion Flow",
        key: "new_deletion_flow",
        status: "active",
        rolloutPercentage: 25,
        description: "New account deletion with recovery period",
        lineReferences: [63, 64, 65],
        createdAt: "2024-01-14T11:00:00Z",
        lastModified: "2024-01-19T10:30:00Z",
        owner: "trust-safety",
      },
      {
        id: "flag-10",
        name: "Old Avatar Upload",
        key: "legacy_avatar_upload",
        status: "stale",
        rolloutPercentage: 0,
        description: "Old file upload component - deprecated",
        lineReferences: [33, 34],
        createdAt: "2022-08-01T10:00:00Z",
        lastModified: "2023-02-01T10:00:00Z",
        owner: "legacy-team",
      },
    ],
  },
};

export function getFeatureFlagsForFile(fileName: string): FeatureFlag[] {
  return fileFeatureFlags[fileName]?.flags || [];
}

export function getFlagsByStatus(
  fileName: string,
  status: FlagStatus
): FeatureFlag[] {
  const flags = getFeatureFlagsForFile(fileName);
  return flags.filter((flag) => flag.status === status);
}

export function getStaleFlags(fileName: string): FeatureFlag[] {
  return getFlagsByStatus(fileName, "stale");
}
