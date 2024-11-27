import { Alert, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../products-page/FoodOrRestaurant";

// Helper function to calculate customization price for an item
const calculateCustomizationPrice = (customisations) => {
  if (!customisations) return 0;
  return customisations.reduce((total, customization) => {
    const price = customization?.item_details?.price?.value || 0;
    const quantity = customization?.quantity?.count || 1;
    return total + (price * quantity);
  }, 0);
};

// Helper function to calculate single item total
const calculateItemTotal = (item) => {
  const basePrice = item?.item?.product?.price?.value || 0;
  const quantity = item?.item?.quantity?.count || 0;
  const customizationPrice = calculateCustomizationPrice(item?.item?.customisations);
  console.log("bhaii price", quantity, basePrice, customizationPrice)
  return (basePrice * quantity) + customizationPrice;
};

// Main function to calculate cart total
export const calculateCartTotal = (cartList) => {
  if (!cartList?.length) return 0;

  return cartList.reduce((total, item) => {
    console.log("bhai price",item, total);
    return total + calculateItemTotal(item);
  }, 0);
};

// Function to format the final price
export const getFormattedPrice = (amount, currencySymbol = '₹', currencySymbolDirection = 'left', digitAfterDecimalPoint = 2) => {
  const formattedAmount = Number(amount).toFixed(digitAfterDecimalPoint);
  
  return currencySymbolDirection === 'left' 
    ? `${currencySymbol}${formattedAmount}`
    : `${formattedAmount}${currencySymbol}`;
};
const checkDifferentProviders = (cartList) => {
  if (!cartList || cartList.length <= 1) return false;

  const firstProviderId = cartList[0]?.item?.provider?.id;
  return cartList.some(item => item?.item?.provider?.id !== firstProviderId);
};

// Updated CartActions component with new price calculation
const CartActions = ({ 
  cartList, 
  t, 
  handleCheckout, 
  currencySymbol, 
  currencySymbolDirection, 
  digitAfterDecimalPoint 
}) => {
  const [hasDifferentProviders, setHasDifferentProviders] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setHasDifferentProviders(checkDifferentProviders(cartList));
    const total = calculateCartTotal(cartList);
    setTotalPrice(total);
  }, [cartList]);

  // Price breakdown function for detailed view
  const getPriceBreakdown = () => {
    return cartList.map(item => ({
      itemName: item?.item?.product?.descriptor?.name,
      basePrice: item?.item?.product?.price?.value || 0,
      customizationPrice: calculateCustomizationPrice(item?.item?.customisations),
      quantity: item?.item?.quantity?.count || 0,
      itemTotal: calculateItemTotal(item)
    }));
  };

  return (
    <Stack alignItems="center" spacing={2} position="sticky" marginTop="auto">
      {hasDifferentProviders && (
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center'
            }
          }}
        >
          {t('You can only order from one store at a time')}
        </Alert>
      )}
      
      <Stack
        borderRadius="5px"
        flexDirection="row"
        sx={{
          width: '100%',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography fontSize="14px" fontWeight={500}>
          {t('Total Price')}
        </Typography>
        <Typography fontSize="15px" fontWeight={700}>
          {getFormattedPrice(
            totalPrice,
            currencySymbol,
            currencySymbolDirection,
            digitAfterDecimalPoint
          )}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        width="100%"
        spacing={1}
      >
        <PrimaryButton
          onClick={handleCheckout}
          variant="contained"
          size="large"
          fullWidth
          borderRadius="7px"
          disabled={hasDifferentProviders}
        >
          {t('Proceed To Checkout')}
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};

export default CartActions;