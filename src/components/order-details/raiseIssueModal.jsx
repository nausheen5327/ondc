import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import validator from "validator";
import _ from "lodash";
import { RTL } from "../RTL/RTL";
import { EventSourcePolyfill } from "event-source-polyfill";
import { getValueFromCookie } from "@/utils/cookies";
import { getCall, postCall } from "@/api/MainApi";
import { CustomToaster } from "../custom-toaster/CustomToaster";

const IssueForm = ({
  open,
  onClose,
  billing_address,
  transaction_id,
  fulfillments,
  bpp_id,
  bpp_uri,
  order_id,
  order_status,
  partailsIssueProductList = [],
  onSuccess,
  quantity,
  domain,
}) => {
  // States
  const [inlineError, setInlineError] = useState({
    selected_id_error: "",
    subcategory_error: "",
    shortDescription_error: "",
    longDescription_error: "",
    image_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedIssueSubcategory, setSelectedIssueSubcategory] = useState();
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [email, setEmail] = useState(billing_address?.email || "");
  const [baseImage, setBaseImage] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [orderQty, setOrderQty] = useState([]);

  // Issue types constant
  const ISSUE_TYPES = [
    {
      key: "002",
      value: "Item",
      subCategory: [
        {
          key: "01",
          value: "Missing items",
          enums: "ITM01",
        },
        {
          key: "02",
          value: "Quantity issue",
          enums: "ITM02",
        },
        {
          key: "03",
          value: "Item mismatch",
          enums: "ITM03",
        },
        {
          key: "04",
          value: "Quality issue",
          enums: "ITM04",
        },
        {
          key: "05",
          value: "Expired item",
          enums: "ITM05",
        },
      ],
    },
    {
      key: "003",
      value: "Fulfillment",
      subCategory: [
        {
          key: "01",
          value: "Wrong delivery address",
          enums: "FLM01",
        },
        {
          key: "02",
          value: "Delay in delivery",
          enums: "FLM02",
        },
        {
          key: "03",
          value: "Delayed delivery",
          enums: "FLM03",
        },
        {
          key: "04",
          value: "Packaging",
          enums: "FLM04",
        },
        {
          key: "07",
          value: "Package info mismatch",
          enums: "FLM07",
        },
        {
          key: "08",
          value: "Incorrectly marked as delivered",
          enums: "FLM08",
        },
      ],
    },
  ];

  const AllCategory = ISSUE_TYPES.map((item) =>
    item.subCategory.map((subcategoryItem) => ({
      ...subcategoryItem,
      category: item.value,
    }))
  ).flat();

  // Refs
  const cancelPartialEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  // Validation functions
  const checkShortDescription = () => {
    if (validator.isEmpty(shortDescription.trim())) {
      setInlineError((prev) => ({
        ...prev,
        shortDescription_error: "Please enter short description",
      }));
      return false;
    }
    return true;
  };

  const checkLongDescription = () => {
    if (validator.isEmpty(longDescription.trim())) {
      setInlineError((prev) => ({
        ...prev,
        longDescription_error: "Please enter long description",
      }));
      return false;
    }
    return true;
  };

  const checkIsOrderSelected = () => {
    if (selectedIds.length <= 0) {
      setInlineError((prev) => ({
        ...prev,
        selected_id_error: "Please select item to raise an issue",
      }));
      return false;
    }
    return true;
  };

  const checkSubcategory = () => {
    if (!selectedIssueSubcategory) {
      setInlineError((prev) => ({
        ...prev,
        subcategory_error: "Please select subcategory",
      }));
      return false;
    }
    return true;
  };

  const checkImages = () => {
    if (
      ["ITM02", "ITM03", "ITM04", "ITM05", "FLM04"].includes(
        selectedIssueSubcategory?.enums
      ) &&
      baseImage.length <= 0
    ) {
      setInlineError((prev) => ({
        ...prev,
        image_error: "Please upload an image file",
      }));
      return false;
    }
    return true;
  };

  // File handling
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file?.size / 1024 > 2048) {
      // Using console.error since we don't have the toast context
      console.error("File size cannot exceed more than 2MB");
      return;
    }

    const base64 = await convertBase64(file);
    setBaseImage([...baseImage, base64]);
    setInlineError((prev) => ({
      ...prev,
      image_error: "",
    }));
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Selection handling
  const isProductSelected = (id) => {
    return (
      selectedIds.filter(({ id: provider_id }) => provider_id === id).length > 0
    );
  };

  const handleProductSelect = (product, isSelected) => {
    setInlineError((prev) => ({
      ...prev,
      selected_id_error: "",
    }));

    if (!isSelected) {
      removeProductToCancel(product);
      return;
    }

    const qty = orderQty.find((q) => q.id === product.id)?.count || 1;
    addProductToCancel(product, qty);
  };

  const addProductToCancel = (attribute, qty) => {
    const modifiedAttributes = {
      id: attribute.id,
      quantity: {
        count: qty,
      },
      product: attribute,
    };
    setSelectedIds([...selectedIds, modifiedAttributes]);
  };

  const removeProductToCancel = (attribute) => {
    setSelectedIds(selectedIds.filter(({ id }) => id !== attribute.id));
  };

  // Form submission
  const handleSubmit = async () => {
    let checksubcategory = false;
    if (order_status === "Completed") {
      checksubcategory = checkSubcategory();
    } else {
      checksubcategory = true;
      setSelectedIssueSubcategory("Fulfillment");
    }
    const allCheckPassed = [
      checksubcategory,
      checkIsOrderSelected(),
      checkShortDescription(),
      checkLongDescription(),
      checkImages(),
    ].every(Boolean);
    console.log("allCheckPassed", checkImages());
    if (!allCheckPassed) return;

    cancelPartialEventSourceResponseRef.current = [];
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const createdDateTime = new Date().toISOString();
      const data = await postCall("/issueApis/v1/issue", {
        context: {
          transaction_id,
          domain,
        },
        message: {
          issue: {
            category: selectedIssueSubcategory.category.toUpperCase(),
            sub_category: selectedIssueSubcategory.enums,
            bppId: bpp_id,
            bpp_uri,
            created_at: createdDateTime,
            updated_at: createdDateTime,
            complainant_info: {
              person: {
                name: billing_address.name,
              },
              contact: {
                phone: billing_address.phone,
                email: email === "" ? user?.email : email,
              },
            },
            description: {
              short_desc: shortDescription,
              long_desc: longDescription,
              additional_desc: {
                url: "https://buyerapp.com/additonal-details/desc.txt",
                content_type: "text/plain",
              },
              images: baseImage,
            },
            order_details: {
              id: order_id,
              state: order_status,
              items: selectedIds,
              fulfillments,
              provider_id: selectedIds?.[0]?.product.provider_details?.id,
            },
            issue_actions: {
              complainant_actions: [],
              respondent_actions: [],
            },
          },
        },
      });
      //Error handling workflow eg, NACK
      if (data.message && data.message.ack.status === "NACK") {
        setLoading(false);
        CustomToaster("error", "Something went wrong");
      } else {
        fetchCancelPartialOrderDataThroughEvents(
          data.context?.message_id,
          createdDateTime
        );
      }
    } catch (err) {
      setLoading(false);
      CustomToaster("error", "Unable to raise issue, Please try again");
    }
  };

  // use this function to fetch cancel product through events
  function fetchCancelPartialOrderDataThroughEvents(
    message_id,
    createdDateTime
  ) {
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    let es = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_BASE_URL}/issueApis/events?messageId=${message_id}`,
      header
    );

    es.addEventListener("on_issue", (e) => {
      if (e?.data) {
        const { messageId } = JSON.parse(e.data);
        getPartialCancelOrderDetails(messageId, createdDateTime);
      } else {
        setLoading(false);
        onSuccess();
      }
    });

    const timer = setTimeout(() => {
      // es.close();
      if (cancelPartialEventSourceResponseRef.current.length <= 0) {
        // dispatchToast(
        //   "Cannot proceed with you request now! Please try again",
        //   toast_types.error
        // );
        setLoading(false);
        onSuccess();
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

  // on Issue api
  async function getPartialCancelOrderDetails(message_id, createdDateTime) {
    try {
      const data = await getCall(
        `/issueApis/v1/on_issue?messageId=${message_id}&createdDateTime=${createdDateTime}`
      );
      cancelPartialEventSourceResponseRef.current = [
        ...cancelPartialEventSourceResponseRef.current,
        data,
      ];
      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      onSuccess();
      CustomToaster("error", err);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }

  useEffect(() => {
    if (quantity) {
      setOrderQty(JSON.parse(JSON.stringify(Object.assign(quantity))));
    }
  }, [quantity]);
  useEffect(() => {
    if (
      order_status === "Created" ||
      order_status === "Accepted" ||
      order_status === "In-progress"
    ) {
      const type = AllCategory.find(({ enums }) => enums === "FLM02");
      setSelectedIssueSubcategory(type);
    }
    return () => {
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    };
  }, []);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Raise an Issue</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <RTL direction="ltr">
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Item Selection */}
            <Box>
              <Typography
                variant="subtitle1"
                color="primary"
                gutterBottom
                required
              >
                Choose Items that had a problem *
              </Typography>
              {partailsIssueProductList.map((product, index) => (
                <Paper key={product.id} variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Checkbox
                        checked={isProductSelected(product.id)}
                        onChange={(e) =>
                          handleProductSelect(product, e.target.checked)
                        }
                        disabled={loading}
                      />
                      <Box>
                        <Typography variant="subtitle2">
                          {product.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          QTY: {orderQty[index]?.count || 0}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2">
                      ₹ {Number(product?.price?.value)?.toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
              {inlineError.selected_id_error && (
                <Typography color="error" variant="caption">
                  {inlineError.selected_id_error}
                </Typography>
              )}
            </Box>

            {/* Issue Category */}
            {order_status === "Completed" ? (
              <FormControl fullWidth error={!!inlineError.subcategory_error}>
                <InputLabel>Select Issue Subcategory *</InputLabel>
                <Select
                  value={selectedIssueSubcategory?.enums || ""}
                  label="Select Issue Subcategory *"
                  onChange={(e) => {
                    const reasonValue = e.target.value;
                    const type = AllCategory.find(
                      ({ enums }) => enums === reasonValue
                    );
                    setSelectedIssueSubcategory(type);
                    setInlineError((error) => ({
                      ...error,
                      subcategory_error: "",
                    }));
                  }}
                >
                  {AllCategory.filter(({ enums }) => enums !== "FLM02").map(
                    ({ value, enums }) => (
                      <MenuItem key={enums} value={enums}>
                        {value}
                      </MenuItem>
                    )
                  )}
                </Select>
                {inlineError.subcategory_error && (
                  <Typography color="error" variant="caption">
                    {inlineError.subcategory_error}
                  </Typography>
                )}
              </FormControl>
            ) : (
              <TextField
                label="Issue Subcategory"
                value="Delay in delivery"
                disabled
                fullWidth
              />
            )}

            {/* Descriptions */}
            <TextField
              required
              label="Short Description"
              placeholder="Enter short description"
              value={shortDescription}
              onChange={(e) => {
                setShortDescription(e.target.value);
                setInlineError((prev) => ({
                  ...prev,
                  shortDescription_error: "",
                }));
              }}
              error={!!inlineError.shortDescription_error}
              helperText={inlineError.shortDescription_error}
              fullWidth
            />

            <TextField
              required
              label="Long Description"
              placeholder="Enter long description"
              value={longDescription}
              onChange={(e) => {
                setLongDescription(e.target.value);
                setInlineError((prev) => ({
                  ...prev,
                  longDescription_error: "",
                }));
              }}
              error={!!inlineError.longDescription_error}
              helperText={inlineError.longDescription_error}
              multiline
              rows={4}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Images (Maximum 4){" "}
                {["ITM02", "ITM03", "ITM04", "ITM05", "FLM04"].includes(
                  selectedIssueSubcategory?.enums
                ) && "*"}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                size="small"
                disabled={baseImage.length >= 4}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpg"
                  onChange={handleFileChange}
                />
              </Button>
              {inlineError.image_error && (
                <Typography
                  color="error"
                  variant="caption"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  {inlineError.image_error}
                </Typography>
              )}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {baseImage.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 60,
                      height: 80,
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        bgcolor: "#F0F0F0",
                      }}
                      onClick={() =>
                        setBaseImage(baseImage.filter((_, i) => i !== index))
                      }
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
      </RTL>
      <RTL direction="ltr">
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
      </RTL>
    </Dialog>
  );
};

export default IssueForm;
