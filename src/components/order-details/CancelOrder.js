import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Typography,
  Grid,
  Checkbox,
  Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CANCELATION_REASONS } from '@/utils/cancellationReason';
import { CustomToaster } from '../custom-toaster/CustomToaster';
import { getValueFromCookie } from '@/utils/cookies';
import { EventSourcePolyfill } from 'event-source-polyfill'
import { getCall, postCall } from '@/api/MainApi';
import { RTL } from '../RTL/RTL';


const CANCEL_ORDER_TYPES = {
  allOrder: "ALL_ORDERS",
  partialOrders: "PARTIAL_ORDERS",
};

// const CANCELATION_REASONS = [
//   { key: 'wrong_item', value: 'Wrong item ordered', isApplicableForCancellation: true },
//   { key: 'delivery_time', value: 'Delivery time too long', isApplicableForCancellation: false },
//   { key: 'changed_mind', value: 'Changed my mind', isApplicableForCancellation: true },
//   { key: 'better_price', value: 'Found better price elsewhere', isApplicableForCancellation: false }
// ];

const CancelOrderModal = ({
  open,
  onClose,
  onSuccess,
  bpp_id,
  transaction_id,
  order_id,
  order_status,
  partailsCancelProductList = [],
  quantity,
  domain,
  bpp_uri,
  handleFetchUpdatedStatus,
  onUpdateOrder
}) => {
  // States
  const [inlineError, setInlineError] = useState({
    selected_id_error: "",
    reason_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCancelType, setSelectedCancelType] = useState(CANCEL_ORDER_TYPES.allOrder);
  const [selectedCancelReasonId, setSelectedCancelReasonId] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [orderQty, setOrderQty] = useState([]);
  const [reasons, setReasons] = useState([]);

  // Refs
  const cancelEventSourceResponseRef = useRef(null);
  const cancelPartialEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  const styles = {
    dialog: {
      '& .MuiDialog-paper': {
        maxWidth: '700px',
        width: '100%',
        margin: '16px',
        borderRadius: '8px'
      }
    },
    content: {
      maxHeight: '500px',
      overflow: 'auto'
    },
    productImage: {
      width: 100,
      height: 80,
      objectFit: 'cover'
    },
    productDetails: {
      flex: 1,
      marginLeft: 2
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1
    },
    reasonSelect: {
      width: '100%',
      marginTop: 2,
      marginBottom: 1
    }
  };

  useEffect(() => {
    if (quantity) {
      setOrderQty(JSON.parse(JSON.stringify(quantity)));
    }
  }, [quantity]);

  useEffect(() => {
    if (selectedCancelType === CANCEL_ORDER_TYPES.allOrder) {
      const data = CANCELATION_REASONS.filter(r => !r.isApplicableForCancellation);
      setReasons(data);
    } else if (selectedCancelType === CANCEL_ORDER_TYPES.partialOrders) {
      setReasons(CANCELATION_REASONS);
    } else {
      setReasons([]);
    }
  }, [selectedCancelType]);

  const checkReason = () => {
    if (Object.keys(selectedCancelReasonId).length <= 0) {
      setInlineError(prev => ({
        ...prev,
        reason_error: "Please Select Reason"
      }));
      return false;
    }
    return true;
  };

  const checkIsOrderSelected = () => {
    if (selectedIds.length <= 0) {
      setInlineError(prev => ({
        ...prev,
        selected_id_error: "Please select a product to cancel"
      }));
      return false;
    }
    return true;
  };

 

  const isProductSelected = (id) => {
    return selectedIds.some(item => item.id === id);
  };

  const handleProductSelection = (product, idx) => {
    if (isProductSelected(product.id)) {
      setSelectedIds(prev => prev.filter(item => item.id !== product.id));
    } else {
      setSelectedIds(prev => [...prev, { ...product, quantity: { count: orderQty[idx]?.count } }]);
    }
    setInlineError(prev => ({
      ...prev,
      selected_id_error: ""
    }));
  };

  const updateQuantity = (productId, newCount, idx) => {
    setOrderQty(prev => {
      const newQty = [...prev];
      newQty[idx] = { ...newQty[idx], count: newCount };
      return newQty;
    });
    
    setSelectedIds(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: { count: newCount } }
          : item
      )
    );
  };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// use this function to fetch cancel product through events
function fetchCancelPartialOrderDataThroughEvents(message_id) {
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    let es = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events?messageId=${message_id}`,
      header
    );
    es.addEventListener("on_update", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getPartialCancelOrderDetails(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (cancelPartialEventSourceResponseRef.current.length <= 0) {
        CustomToaster('error',"Cannot proceed with you request now! Please try again");
        setLoading(false);
      }
    }, 20000);

    eventTimeOutRef.current = [
      ...eventTimeOutRef.current,
      {
        eventSource: es,
        timer,
      },
    ];
  }
// on cancel Api
async function getCancelOrderDetails(message_id) {
    try {
      const data = await getCall(`/clientApis/v2/on_cancel_order?messageId=${message_id}`);
      cancelEventSourceResponseRef.current = [...cancelEventSourceResponseRef.current, data];
      setLoading(false);
      if (data?.message) {
        onSuccess();
      } else {
        CustomToaster("error","Something went wrong!, product status cannot be updated");
      }
    } catch (err) {
      setLoading(false);
      CustomToaster("error",err?.message);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }
  function fetchCancelOrderDataThroughEvents(message_id) {
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    let es = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events?messageId=${message_id}`,
      header
    );
    es.addEventListener("on_cancel", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getCancelOrderDetails(messageId);
      onUpdateOrder();
    });

    const timer = setTimeout(() => {
      es.close();
      if (cancelEventSourceResponseRef.current.length <= 0) {
        CustomToaster("error","Cannot proceed with you request now! Please try again");
        setLoading(false);
      }
    }, 20000);

    eventTimeOutRef.current = [
      ...eventTimeOutRef.current,
      {
        eventSource: es,
        timer,
      },
    ];
  }

async function handleFetchCancelOrderDetails() {
    const allCheckPassed = [checkReason()].every(Boolean);
    if (!allCheckPassed) return;

    cancelEventSourceResponseRef.current = [];
    setLoading(true);
    try {
      const { context } = await postCall("/clientApis/v2/cancel_order", {
          context: {
            domain,
            bpp_id,
            bpp_uri,
            transaction_id,
          },
          message: {
            order_id,
            cancellation_reason_id: selectedCancelReasonId?.key,
          },
        });
      fetchCancelOrderDataThroughEvents(context?.message_id);
    } catch (err) {
      setLoading(false);
      CustomToaster('error',err?.message);
    }
  }  



  // use this api to partial update orders
  async function handlePartialOrderCancel() {
    const allCheckPassed = [checkReason(), checkIsOrderSelected()].every(Boolean);
    if (!allCheckPassed) return;

    cancelPartialEventSourceResponseRef.current = [];
    setLoading(true);
    const map = new Map();
    selectedIds.map((item) => {
      const provider_id = item?.provider_details?.id;
      if (map.get(provider_id)) {
        return map.set(provider_id, [...map.get(provider_id), item]);
      }
      return map.set(provider_id, [item]);
    });
    const requestObject = Array.from(map.values());
    const payload = selectedIds?.map((item) => ({
      id: item?.id,
      quantity: {
        count: item.quantity.count,
      },
      tags: {
        update_type: "cancel",
        reason_code: selectedCancelReasonId?.key,
        ttl_approval: item?.["@ondc/org/return_window"] ? item?.["@ondc/org/return_window"] : "",
        ttl_reverseqc: "P3D",
        image: "",
      },
    }));

    try {
      const data = await 
        postCall(
          "clientApis/v2/update",
          requestObject?.map((item, index) => {
            return {
              context: {
                domain,
                bpp_id,
                bpp_uri,
                transaction_id,
              },
              message: {
                update_target: "item",
                order: {
                  id: order_id,
                  state: order_status,
                  provider: {
                    id: item?.[index]?.provider_details?.id,
                  },
                  items: payload,
                },
              },
            };
          })
        );
      //Error handling workflow eg, NACK
      if (data[0].error && data[0].message.ack.status === "NACK") {
        setLoading(false);
        CustomToaster('error',data[0].error.message);
      } else {
        fetchCancelPartialOrderDataThroughEvents(
          data?.map((txn) => {
            const { context } = txn;
            return context?.message_id;
          })
        );
      }
    } catch (err) {
      setLoading(false);
      CustomToaster('error',err?.message);
    }
  }

  // on Update api
  async function getPartialCancelOrderDetails(message_id) {
    try {
      const data = await getCall(`/clientApis/v2/on_update?messageId=${message_id}`);
      cancelPartialEventSourceResponseRef.current = [...cancelPartialEventSourceResponseRef.current, data];
      setLoading(false);
      if (data?.message) {
        onSuccess();
      } else {
        CustomToaster("error","Something went wrong!, product status cannot be updated");
      }
    } catch (err) {
      setLoading(false);
      CustomToaster("error",err?.message);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }



  

 

  // use this function to add attribute in filter list
  function addProductToCancel(attribute, qty) {
    let latestAttribute = JSON.parse(JSON.stringify(Object.assign({}, attribute)));
    latestAttribute.quantity.count = qty;
    setSelectedIds([...selectedIds, latestAttribute]);
  }

  // use this function to remove the selected attribute from filter
  function removeProductToCancel(attribute) {
    setSelectedIds(selectedIds.filter(({ id }) => id !== attribute.id));
  }

  // use this function to update quantity of the selected product
  function updateQtyForSelectedProduct(pId, qty) {
    let data = JSON.parse(JSON.stringify(Object.assign([], selectedIds)));
    data = data.map((item) => {
      if (item.id === pId) {
        item.quantity.count = qty;
      } else {
      }
      return item;
    });
    setSelectedIds(data);
  }

  useEffect(() => {
    return () => {
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    };
  }, []);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   return (
//     <RTL direction='ltr'>
//     <Dialog
//       open={open}
//       onClose={onClose}
//       sx={styles.dialog}
//     >
//       <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', padding: 2 }}>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',fontSize:'16px' }}>
//           Cancel Order
//           <IconButton onClick={onClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         </div>
//       </DialogTitle>

//       <DialogContent sx={styles.content}>
//         <RadioGroup
//           value={selectedCancelType}
//           onChange={(e) => setSelectedCancelType(e.target.value)}
//         >
//           <FormControlLabel
//             value={CANCEL_ORDER_TYPES.allOrder}
//             control={<Radio />}
//             label="Cancel Complete Orders"
//             disabled={loading}
//           />
//         </RadioGroup>

//         {partailsCancelProductList.length > 0 && selectedCancelType === CANCEL_ORDER_TYPES.partialOrders && (
//           <Grid container spacing={2} sx={{ mt: 2 }}>
//             {partailsCancelProductList.map((product, idx) => (
//               <Grid item xs={12} key={product.id}>
//                 <div style={{ display: 'flex', alignItems: 'start' }}>
//                   <img 
//                     src={product.descriptor?.symbol} 
//                     alt={product.name}
//                     style={styles.productImage}
//                   />
//                   <div style={styles.productDetails}>
//                     <Typography variant="subtitle1">{product.name}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       QTY: {quantity?.[idx]?.count ?? "0"} x ₹{Number(product?.price?.value)?.toFixed(2)}
//                     </Typography>
//                     <Checkbox
//                       checked={isProductSelected(product.id)}
//                       onChange={() => handleProductSelection(product, idx)}
//                       disabled={loading}
//                     />
//                     {isProductSelected(product.id) && (
//                       <div style={styles.quantityControls}>
//                         <IconButton 
//                           size="small"
//                           disabled={orderQty[idx]?.count <= 1}
//                           onClick={() => updateQuantity(product.id, orderQty[idx]?.count - 1, idx)}
//                         >
//                           -
//                         </IconButton>
//                         <Typography>{orderQty[idx]?.count}</Typography>
//                         <IconButton
//                           size="small"
//                           disabled={orderQty[idx]?.count >= quantity[idx]?.count}
//                           onClick={() => updateQuantity(product.id, orderQty[idx]?.count + 1, idx)}
//                         >
//                           +
//                         </IconButton>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         )}

//         {inlineError.selected_id_error && (
//           <Typography color="error" variant="caption" sx={{ mt: 1 }}>
//             {inlineError.selected_id_error}
//           </Typography>
//         )}

//         <Select
//           fullWidth
//           value={selectedCancelReasonId.key || ''}
//           onChange={(e) => {
//             const reason = reasons.find(r => r.key === e.target.value);
//             setSelectedCancelReasonId(reason || {});
//             setInlineError(prev => ({ ...prev, reason_error: '' }));
//           }}
//           displayEmpty
//           sx={styles.reasonSelect}
//         >
//           <MenuItem value="" disabled>Select reason for cancellation</MenuItem>
//           {reasons.map((reason) => (
//             <MenuItem key={reason.key} value={reason.key}>
//               {reason.value}
//             </MenuItem>
//           ))}
//         </Select>

//         {inlineError.reason_error && (
//           <Typography color="error" variant="caption">
//             {inlineError.reason_error}
//           </Typography>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ borderTop: '1px solid #e0e0e0', padding: 2 }}>
//         <Button 
//           onClick={onClose} 
//           disabled={loading}
//           variant="outlined"
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={() => {
//             if (selectedCancelType === CANCEL_ORDER_TYPES.allOrder) {
//               handleFetchCancelOrderDetails();
//             } else {
//               handlePartialOrderCancel();
//             }
//           }}
//           disabled={loading}
//           variant="contained"
//         >
//           Confirm
//         </Button>
//       </DialogActions>
//     </Dialog>
//     </RTL>
//   );
// };

// export default CancelOrderModal;

return (
    <RTL direction='ltr'>
      <Dialog
        open={open}
        onClose={onClose}
        sx={styles.dialog}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', padding: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Cancel Order</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent sx={styles.content}>
          <RadioGroup
            value={selectedCancelType}
            onChange={(e) => setSelectedCancelType(e.target.value)}
          >
            <FormControlLabel
              value={CANCEL_ORDER_TYPES.allOrder}
              control={<Radio />}
              label="Cancel Complete Orders"
              disabled={loading}
            />
            <FormControlLabel
              value={CANCEL_ORDER_TYPES.partialOrders}
              control={<Radio />}
              label="Cancel Selected Items"
              disabled={loading || !partailsCancelProductList.length || 
                (partailsCancelProductList.length === 1 && quantity[0]?.count === 1)}
            />
          </RadioGroup>

          {partailsCancelProductList.length > 0 && selectedCancelType === CANCEL_ORDER_TYPES.partialOrders && (
            <div style={{ marginTop: 16 }}>
              {partailsCancelProductList.map((product, idx) => (
                <div key={product.id} style={styles.productCard}>
                  <img 
                    src={product.descriptor?.symbol} 
                    alt={product.name}
                    style={styles.productImage}
                  />
                  <div style={styles.productDetails}>
                    <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      QTY: {quantity?.[idx]?.count ?? "0"} x ₹{Number(product?.price?.value)?.toFixed(2)}
                    </Typography>
                    
                    {Object.keys(product?.customizations || {}).map((key) => (
                      <Typography key={key} variant="body2" color="text.secondary">
                        {product.customizations[key].title} (₹{product.customizations[key].price.value})
                      </Typography>
                    ))}

                    <div style={styles.priceSection}>
                      <Typography variant="subtitle2">
                        ₹{Number(product?.price?.value)?.toFixed(2)}
                      </Typography>
                      <Checkbox
                        checked={isProductSelected(product.id)}
                        onChange={() => handleProductSelection(product, idx)}
                        disabled={loading}
                      />
                    </div>

                    {isProductSelected(product.id) && (
                      <div style={styles.quantityControls}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={styles.quantityButton}
                          disabled={orderQty[idx]?.count <= 1}
                          onClick={() => onUpdateQty(orderQty[idx]?.count - 1, idx, product.id)}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>
                        <Typography>{orderQty[idx]?.count}</Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={styles.quantityButton}
                          disabled={orderQty[idx]?.count >= quantity[idx]?.count}
                          onClick={() => onUpdateQty(orderQty[idx]?.count + 1, idx, product.id)}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {inlineError.selected_id_error && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              {inlineError.selected_id_error}
            </Typography>
          )}

          <Select
            fullWidth
            value={selectedCancelReasonId.key || ''}
            onChange={(e) => {
              const reason = reasons.find(r => r.key === e.target.value);
              setSelectedCancelReasonId(reason || {});
              setInlineError(prev => ({ ...prev, reason_error: '' }));
            }}
            displayEmpty
            sx={styles.reasonSelect}
          >
            <MenuItem value="" disabled>Select reason for cancellation</MenuItem>
            {reasons.map((reason) => (
              <MenuItem key={reason.key} value={reason.key}>
                {reason.value}
              </MenuItem>
            ))}
          </Select>

          {inlineError.reason_error && (
            <Typography color="error" variant="caption">
              {inlineError.reason_error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', padding: 2 }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (selectedCancelType === CANCEL_ORDER_TYPES.allOrder) {
                handleFetchCancelOrderDetails();
              } else {
                handlePartialOrderCancel();
              }
            }}
            disabled={loading}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </RTL>
  );
};

export default CancelOrderModal;