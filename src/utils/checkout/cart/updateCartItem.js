import { putCall } from "@/api/MainApi";
import { getValueFromCookie } from "@/utils/cookies";

let user = {};
const userCookie = getValueFromCookie("user");

if (userCookie) {
  try {
    user = JSON.parse(userCookie);
  } catch (error) {
    console.log("Error parsing user cookie:", error);
  }
}

export const updateCartItem = async (cartItems, increment, uniqueId) => {
  console.log(cartItems, increment, uniqueId);
  const url = `/clientApis/v2/cart/${user.id}/${uniqueId}`;
  const items = [...cartItems];
  const itemIndex = items.findIndex((item) => item._id === uniqueId);
  
  if (itemIndex !== -1) {
    // Create a deep copy of the cart item to modify
    let updatedCartItem = JSON.parse(JSON.stringify(items[itemIndex]));

    if (increment !== null) {
      if (increment) {
        const productMaxQuantity = updatedCartItem?.item?.product?.quantity?.maximum;
        if (productMaxQuantity) {
          if (updatedCartItem.item.quantity.count < productMaxQuantity.count) {
            updatedCartItem.item.quantity.count += 1;

            let customisations = updatedCartItem.item.customisations;

            if (customisations) {
              customisations = customisations.map((c) => ({
                ...c,
                quantity: { ...c.quantity, count: c.quantity.count + 1 }
              }));
              updatedCartItem.item.customisations = customisations;
            }

            // Create payload for API
            const payload = {
              ...updatedCartItem.item,
              id: updatedCartItem.item.id
            };

            try {
              const res = await putCall(url, payload);
              return res;
            } catch (error) {
              console.error("Error updating cart item:", error);
              throw error;
            }
          }
        } else {
          updatedCartItem.item.quantity.count += 1;
          
          // Create payload for API
          const payload = {
            ...updatedCartItem.item,
            id: updatedCartItem.item.id
          };

          try {
            const res = await putCall(url, payload);
            return res;
          } catch (error) {
            console.error("Error updating cart item:", error);
            throw error;
          }
        }
      } else {
        // Decrement case
        if (updatedCartItem.item.quantity.count > 1) {
          updatedCartItem.item.quantity.count -= 1;

          let customisations = updatedCartItem.item.customisations;
          if (customisations) {
            customisations = customisations.map((c) => ({
              ...c,
              quantity: { ...c.quantity, count: c.quantity.count - 1 }
            }));
            updatedCartItem.item.customisations = customisations;
          }

          // Create payload for API
          const payload = {
            ...updatedCartItem.item,
            id: updatedCartItem.item.id
          };

          try {
            const res = await putCall(url, payload);
            return res;
          } catch (error) {
            console.error("Error updating cart item:", error);
            throw error;
          }
        }
      }
    }
  }
};