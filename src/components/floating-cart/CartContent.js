import React from "react";
import { 
  Grid, 
  IconButton, 
  Stack, 
  Tooltip, 
  Typography,
  Card,
  Divider,
  Box,
  Chip
} from "@mui/material";
import { Store, Clock } from 'lucide-react';
import CustomImageContainer from "../CustomImageContainer";
import { OrderFoodAmount, OrderFoodName, OrderFoodSubtitle } from "../checkout-page/CheckOut.style";
import VisibleVariations from "./VisibleVariations";
import {
  calculateItemBasePrice,
  getAmount,
  getConvertDiscount,
  getSelectedAddOn,
  getTotalVariationsPrice,
  handleTotalAmountWithAddonsFF
} from "@/utils/customFunctions";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CircularLoader from "../loader/CircularLoader";
import HalalSvg from "@/components/food-card/HalalSvg";

const CartContent = ({
  item,
  handleProductUpdateModal,
  productBaseUrl,
  t,
  handleIncrement,
  handleDecrement,
  handleRemove,
  updatedLoading,
  removeIsLoading
}) => {
  const currencySymbol = '₹';
  const currencySymbolDirection = 'left';
  const digitAfterDecimalPoint = 2;

  const getFulfillmentTime = (time) => {
    if (!time) return '';
    const minutes = time.replace('PT', '').replace('M', '');
    return `${minutes} mins`;
  };

  const getCustomizationTotal = () => {
    if (!item?.item?.customisations) return 0;
    return item.item.customisations.reduce((total, cust) => 
      total + (cust.item_details.price.value || 0), 0
    );
  };

  return (
    <Card sx={{ 
      width: '100%',  
      mb: 2,
      '& .lucide': {
        width: '16px',
        height: '16px'
      }
    }}>
      {/* Restaurant Details */}
      <Stack direction="row" spacing={1} style={{marginTop:'10px',marginLeft:'10px'}}>
        <CustomImageContainer
          height="30px"
          width="30px"
          src={item?.item?.provider?.descriptor?.symbol}
          smHeight="25px"
          smWidth="25px"
          objectFit="cover"
          borderRadius="8px"
        />
        <Stack  spacing={0.5} sx={{ flex: 1 ,flexDirection:'row'}}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {item?.item?.provider?.descriptor?.name} &nbsp; 
          </Typography>
          <Chip
              icon={<Clock />}
              label={`${getFulfillmentTime(item?.item?.product?.['@ondc/org/time_to_ship'])} delivery`}
              size="small"
              variant="outlined"
            />
        </Stack>
      </Stack>
      <Stack style={{marginLeft:'10px'}}>
<Typography variant="body2" color="text.secondary">
            {item?.item?.provider?.descriptor?.short_desc}
          </Typography>
          </Stack>
      {/* <Divider sx={{ my: 2 }} /> */}

      {/* Item Details */}
      <Grid container spacing={2} paddingRight={'25px'} style={{marginLeft:'5px'}} alignItems="center">
        {/* Item Image */}
        <Grid item xs={3} sm={3} md={3}>
          <Box 
            onClick={() => handleProductUpdateModal(item)} 
            sx={{ cursor: 'pointer' }}
          >
            <CustomImageContainer
              height="90px"
              width="90px"
              src={productBaseUrl}
              smHeight="70px"
              smWidth="70px"
              objectFit="cover"
              borderRadius="16px"
            />
          </Box>
        </Grid>

        {/* Item Info */}
        <Grid item xs={9} sm={9} md={9}>
          <Stack spacing={1}>
            {/* Item Name and Halal Badge */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <OrderFoodName
                sx={{ cursor: 'pointer' }}
                onClick={() => handleProductUpdateModal(item)}
              >
                {item.item.product.descriptor.name}
              </OrderFoodName>
              {item?.halal_tag_status === 1 && item?.is_halal === 1 && (
                <Tooltip arrow title={t("This is a halal food")}>
                  <IconButton sx={{ padding: 0 }}>
                    <HalalSvg />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>

            {/* Variations */}
            {item?.variations?.length > 0 && (
              <VisibleVariations variations={item.variations} t={t} />
            )}

            {/* Customizations */}
            {item?.item?.customisations && (
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Customizations:
                </Typography>
                {item.item.customisations.map((customization) => (
                  <Stack 
                    key={customization.id} 
                    direction="row" 
                    justifyContent="flex-start"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2">
                      {customization.item_details.descriptor.name} &nbsp;
                    </Typography>
                    <Typography variant="body2">
                      +{currencySymbol}{customization.item_details.price.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}

            {/* Price and Quantity Controls */}
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <OrderFoodAmount>
                {getAmount(
                  handleTotalAmountWithAddonsFF(
                    item.item.product.price.value + getCustomizationTotal(),
                    item?.selectedAddons
                  ),
                  currencySymbolDirection,
                  currencySymbol,
                  digitAfterDecimalPoint
                )}
              </OrderFoodAmount>

              <Stack direction="row" alignItems="center" spacing={2}>
                {item?.item?.quantity.count === 1 ? (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    color="error"
                    disabled={removeIsLoading}
                    onClick={() => handleRemove(item)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton
                    disabled={updatedLoading}
                    onClick={() => handleDecrement(item)}
                    size="small"
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: 'grey.200',
                      borderRadius: '50%',
                      '&:hover': {
                        bgcolor: 'grey.300'
                      }
                    }}
                  >
                    <RemoveIcon sx={{ width: 16, height: 16 }} />
                  </IconButton>
                )}

                {updatedLoading ? (
                  <CircularLoader size="14px" />
                ) : (
                  <Typography sx={{ width: 14 }}>
                    {item?.item?.quantity?.count}
                  </Typography>
                )}

                <IconButton
                  disabled={updatedLoading}
                  onClick={() => handleIncrement(item)}
                  size="small"
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: 'grey.200',
                    borderRadius: '50%',
                    '&:hover': {
                      bgcolor: 'grey.300'
                    }
                  }}
                >
                  <AddIcon sx={{ width: 16, height: 16 }} />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CartContent;