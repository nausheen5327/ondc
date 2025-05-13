export const pageview = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-NM8X1XVNT9', {
        page_path: url,
      });
    }
  };


  export const trackSearchEvent = (searchTerm, resultsCount) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        results_count: resultsCount,
      });
    }
  };
  

 
  export const trackProductView = (product) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        item_detail: product
      });
    }
  };

  export const trackAddToCart = (product) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        items: [product]
      });
    }
  };

export const trackBeginCheckout = (cartItems) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Transform the cart items into the format needed for GA4
  const items = cartItems.map(cartItem => {
    const item = cartItem.item;
    const product = item.product;
    const customisation = item.customisations?.[0]?.item_details;
    
    return {
      item_id: item.local_id,
      item_name: product.descriptor.name,
      price: customisation?.price?.value || 0,
      quantity: item.quantity?.count || 1,
      item_category: product.category_id,
      item_variant: customisation?.descriptor?.name || '',
      // You can add more parameters as needed
    };
  });
  
  // Calculate total value from items
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Send the event to GA4
  window.gtag('event', 'begin_checkout', {
    currency: 'INR', // Using INR based on your data
    value: total,
    items: items,
  });
};


export const trackPlaceOrderClicked = (cart)=>{
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'place_order_clicked', {
      data: cart
    });
  }
}


export const trackPaymentGatewayOpen = ()=>{
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_gateway_screen_visited', {
      data: true
    });
  }
}


export const trackPaymentSuccess = (paymentResponse)=>{
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_success', {
      data: paymentResponse
    });
  }
}
export const trackPaymentFailure = (paymentResponse)=>{
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_failure', {
      data: paymentResponse
    });
  }
}
export const trackPaymentGatewayClose = ()=>{
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_gateway_screen_closed', {
      data: true
    });
  }
}

export const trackPurchase = (orderDetails) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      data: orderDetails
    });
  }
}