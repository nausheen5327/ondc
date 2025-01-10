import { postCall } from "@/api/MainApi";

// Helper functions for managing cart before authentication
const preAuthCartHelpers = {
    // Get cart items from localStorage
    getPreAuthCart: () => {
      try {
        return JSON.parse(localStorage.getItem('cartItemsPreAuth')) || [];
      } catch (error) {
        console.error('Error getting pre-auth cart:', error);
        return [];
      }
    },
  
    // Save cart items to localStorage
    savePreAuthCart: (items) => {
      try {
        localStorage.setItem('cartItemsPreAuth', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving pre-auth cart:', error);
      }
    },
  
    // Add item to pre-auth cart
    addToPreAuthCart: (payload) => {
      const existingItems = preAuthCartHelpers.getPreAuthCart();
      
      // Check if item with same customizations exists
      const existingItemIndex = existingItems.findIndex(item => {
        if (item.id !== payload.id) return false;
        
        // If there are customizations, check if they match
        if (payload.customisations && payload.customisations.length > 0) {
          const existingIds = item.customisations.map(c => c.local_id).sort();
          const newIds = payload.customisations.map(c => c.local_id).sort();
          return JSON.stringify(existingIds) === JSON.stringify(newIds);
        }
        
        return true;
      });
  
      if (existingItemIndex !== -1) {
        // Update existing item
        const item = existingItems[existingItemIndex];
        const maxCount = item.product.quantity.maximum.count;
        const newCount = item.quantity.count + 1;
        
        if (newCount <= maxCount) {
          item.quantity.count = newCount;
          existingItems[existingItemIndex] = item;
        }
      } else {
        // Add new item
        payload.quantity = { count: 1 };
        existingItems.push(payload);
      }
  
      preAuthCartHelpers.savePreAuthCart(existingItems);
      return existingItems;
    },
  
    // Update item quantity in pre-auth cart
    updatePreAuthCartItem: (itemId, isIncrement, customisations = []) => {
      const existingItems = preAuthCartHelpers.getPreAuthCart();
      
      const itemIndex = existingItems.findIndex(item => {
        if (item.id !== itemId) return false;
        
        if (customisations.length > 0) {
          const existingIds = item.customisations.map(c => c.local_id).sort();
          const newIds = customisations.map(c => c.local_id).sort();
          return JSON.stringify(existingIds) === JSON.stringify(newIds);
        }
        
        return true;
      });
  
      if (itemIndex !== -1) {
        const item = existingItems[itemIndex];
        const maxCount = item.product.quantity.maximum.count;
        const newCount = isIncrement ? item.quantity.count + 1 : item.quantity.count - 1;
        
        if (newCount <= 0) {
          existingItems.splice(itemIndex, 1);
        } else if (newCount <= maxCount) {
          item.quantity.count = newCount;
          existingItems[itemIndex] = item;
        }
      }
  
      preAuthCartHelpers.savePreAuthCart(existingItems);
      return existingItems;
    },
  
    // Delete item from pre-auth cart
    deleteFromPreAuthCart: (itemId, customisations = []) => {
      const existingItems = preAuthCartHelpers.getPreAuthCart();
      
      const filteredItems = existingItems.filter(item => {
        if (item.id !== itemId) return true;
        
        if (customisations.length > 0) {
          const existingIds = item.customisations.map(c => c.local_id).sort();
          const newIds = customisations.map(c => c.local_id).sort();
          return JSON.stringify(existingIds) !== JSON.stringify(newIds);
        }
        
        return false;
      });
  
      preAuthCartHelpers.savePreAuthCart(filteredItems);
      return filteredItems;
    },
  
    // Sync pre-auth cart with server after login
    syncPreAuthCart: async (userId) => {
      const preAuthItems = preAuthCartHelpers.getPreAuthCart();
      
      if (preAuthItems.length === 0) return;
  
      try {
        // Add each pre-auth item to the server cart
        for (const item of preAuthItems) {
          await postCall(`/clientApis/v2/cart/${userId}`, item);
        }
        
        // Clear pre-auth cart after successful sync
        localStorage.removeItem('cartItemsPreAuth');
      } catch (error) {
        console.error('Error syncing pre-auth cart:', error);
      }
    }
  };
  
  export default preAuthCartHelpers;