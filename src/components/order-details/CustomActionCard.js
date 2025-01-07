import React, { useContext, useState, useRef } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Radio,
  FormControlLabel,
  TextField,
  IconButton
} from "@mui/material";
import { EventSourcePolyfill } from 'event-source-polyfill'
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import validator from "validator";
import { getValueFromCookie } from "@/utils/cookies";
import { getCall, postCall } from "@/api/MainApi";
import { CustomToaster } from "../custom-toaster/CustomToaster";

export default function CustomerActionCard({
  supportActionDetails,
  onClose,
  onSuccess,
}) {
  // CONSTANTS
  const token = getValueFromCookie("token");
  const ACTION_TYPES = {
    closeIssue: "CLOSE_ISSUE",
    escalateIssue: "ESCALATE_ISSUE",
  };

  // STATES
  const [inlineError, setInlineError] = useState({
    remarks_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [customerRemarks, setCustomerRemarks] = useState("");
  const [selectedCancelType, setSelectedCancelType] = useState(
    ACTION_TYPES.closeIssue
  );
  const [like, setLike] = useState();
  const [dislike, setDislike] = useState();

  // REFS
  const cancelPartialEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  // CONTEXT

  // HOOKS


  function checkRemarks() {
    if (validator.isEmpty(customerRemarks)) {
      setInlineError((error) => ({
        ...error,
        remarks_error: "Please enter the remarks",
      }));
      return false;
    }
    return true;
  }

  function checkRating() {
    if (like === undefined && dislike === undefined) {
      setInlineError((error) => ({
        ...error,
        remarks_error: "Please choose a rating",
      }));
      return false;
    }
    return true;
  }

  async function contactSupport() {
    if (selectedCancelType === ACTION_TYPES.closeIssue && !checkRating()) {
      return;
    }
    if (selectedCancelType === ACTION_TYPES.escalateIssue && !checkRemarks()) {
      return;
    }
    cancelPartialEventSourceResponseRef.current = [];
    setLoading(true);
    try {
      const { bpp_id, issue_actions, issue_id, transaction_id, created_at, domain } = supportActionDetails;
        console.log("issue actions",issue_actions)
      const dataObject = {
        context: {
          action: "issue",
          bpp_id,
          domain,
          timestamp: new Date(),
          transaction_id
        },
      };

      if (selectedCancelType === ACTION_TYPES.closeIssue) {
        dataObject.message = {
          issue: {
            id: issue_id,
            status: "CLOSED",
            rating: like ? "THUMBS-UP" : "THUMBS-DOWN",
            updated_at: new Date(),
            created_at,
            issue_actions: {
              complainant_actions: [
                ...issue_actions.complainant_actions,
                {
                  complainant_action: "CLOSE",
                  short_desc: "Complaint closed",
                  updated_at: new Date(),
                  updated_by: issue_actions.complainant_actions[0].updated_by,
                },
              ],
            },
          },
        };
      } else {
        dataObject.message = {
          issue: {
            id: issue_id,
            status: "OPEN",
            issue_type: "GRIEVANCE",
            updated_at: new Date(),
            created_at,
            issue_actions: {
              complainant_actions: [
                ...issue_actions.complainant_actions,
                {
                  complainant_action: "ESCALATE",
                  short_desc: customerRemarks,
                  updated_at: new Date(),
                  updated_by: issue_actions.complainant_actions[0].updated_by,
                },
              ],
            },
          },
        };
      }

      const data = await 
        postCall("/issueApis/v1/issue", dataObject)
      ;
      if (data.message && data.message.ack.status === "NACK") {
        setLoading(false);
        CustomToaster("error","Something went wrong");
      } else {
        if (selectedCancelType === ACTION_TYPES.escalateIssue) {
          fetchCancelPartialOrderDataThroughEvents(data.context?.message_id, issue_actions);
        } else {
          onSuccess([{
            respondent_action: "CLOSE",
            short_desc: "Complaint closed",
            updated_at: new Date().toISOString(),
            updated_by: issue_actions.complainant_actions[0].updated_by,
          }]);
        }
      }
    } catch (err) {
      setLoading(false);
      CustomToaster('error',err);
    }
  }

  function fetchCancelPartialOrderDataThroughEvents(message_id, issue_actions) {
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
      const { messageId } = JSON.parse(e?.data);
      getPartialCancelOrderDetails(messageId, issue_actions);
    });

    const timer = setTimeout(() => {
      es.close();
      if (cancelPartialEventSourceResponseRef.current.length <= 0) {
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

  async function getPartialCancelOrderDetails(message_id, issue_actions) {
    try {
      const data = await 
        getCall(`/issueApis/v1/on_issue?messageId=${message_id}`);
      cancelPartialEventSourceResponseRef.current = [
        ...cancelPartialEventSourceResponseRef.current,
        data,
      ];
      let successData = [{
        respondent_action: "ESCALATE",
        short_desc: customerRemarks,
        updated_at: new Date().toISOString(),
        updated_by: issue_actions.complainant_actions[0].updated_by,
      }]
      if (data?.message) {
        setLoading(false);
        let respondentArray = data.message?.issue?.issue_actions?.respondent_actions
        let processObj = respondentArray[respondentArray.length - 1]
        onSuccess([...successData, processObj])
      } else {
        setLoading(false);
        onSuccess(successData)
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

  const review = (type) => {
    setInlineError((inlineError) => ({
      ...inlineError,
      remarks_error: "",
    }));
    if (type === "like") {
      setLike(true);
      setDislike(false);
    } else {
      setLike(false);
      setDislike(true);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '8px'
        }
      }}
    >
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <Typography variant="h6">Take Action</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box style={{ padding: '16px 24px' }}>
        <Box style={{ display: 'flex', gap: '16px' }}>
          <FormControlLabel
            disabled={loading}
            control={
              <Radio
                checked={selectedCancelType === ACTION_TYPES.closeIssue}
                onChange={() => {
                  setSelectedCancelType(ACTION_TYPES.closeIssue);
                  setInlineError((inlineError) => ({
                    ...inlineError,
                    remarks_error: "",
                  }));
                }}
              />
            }
            label="Close"
          />

          <FormControlLabel
            disabled={loading}
            control={
              <Radio
                checked={selectedCancelType === ACTION_TYPES.escalateIssue}
                onChange={() => {
                  setSelectedCancelType(ACTION_TYPES.escalateIssue);
                  setInlineError((inlineError) => ({
                    ...inlineError,
                    remarks_error: "",
                  }));
                }}
              />
            }
            label="Escalate"
          />
        </Box>
      </Box>

      <DialogContent style={{ padding: '16px 24px 16px' }}>
        {selectedCancelType === ACTION_TYPES.closeIssue ? (
          <Box>
            <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
              Choose Rating *
            </Typography>
            <Box style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <IconButton onClick={() => review("like")} color={like ? "primary" : "default"}>
                <ThumbUpIcon />
              </IconButton>
              <IconButton onClick={() => review("dislike")} color={dislike ? "primary" : "default"}>
                <ThumbDownIcon />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <TextField
            label="Remarks"
            variant="outlined"
            fullWidth
            placeholder="Enter the remarks"
            value={customerRemarks}
            onChange={(event) => {
              const remarks = event.target.value;
              setCustomerRemarks(remarks);
              setInlineError((inlineError) => ({
                ...inlineError,
                remarks_error: "",
              }));
            }}
            error={!!inlineError.remarks_error}
            helperText={inlineError.remarks_error}
            required
          />
        )}
      </DialogContent>

      <DialogActions style={{ padding: '16px 24px' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          style={{ marginRight: '8px' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={contactSupport}
          disabled={loading}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}