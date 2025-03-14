export function constructQouteObject(cartItems) {
    const map = new Map();
    cartItems.map((item) => {
      let bpp_uri = item?.product?.context?.bpp_uri;
      if (bpp_uri) {
        item.bpp_uri = bpp_uri;
      }
  
      const provider_id = item.provider.id;
      if (map.get(provider_id)) {
        return map.set(provider_id, [...map.get(provider_id), item]);
      }
      return map.set(provider_id, [item]);
    });
    return Array.from(map.values());
  }
  