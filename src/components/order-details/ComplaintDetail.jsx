import React, { useEffect, useRef, useState } from "react";
import { CssBaseline, Container, Button } from "@mui/material";
import OrderDetails from "./OrderDetails";
import PushNotificationLayout from "../PushNotificationLayout";
import { useDispatch, useSelector } from "react-redux";
import CustomContainer from "../container";
import { EventSourcePolyfill } from 'event-source-polyfill'
import moment from "moment";
import {
  Timeline,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
} from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import styled from "@emotion/styled";
import { OrderApi } from "@/hooks/react-query/config/orderApi";
import { useQuery } from "react-query";
import { setIsLoading } from "@/redux/slices/global";
import { getCall, postCall } from "@/api/MainApi";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import { RTL } from "../RTL/RTL";
import useStyles from "./style";
import LoadingOverlay from "../common/layoutProgress";
import { getValueFromCookie } from "@/utils/cookies";
import CustomerActionCard from "./CustomActionCard";
import { compareDateWithDuration } from "@/utils/issueType";
const StyledTimelineItem = styled(TimelineItem)(({ theme }) => ({
  "&.MuiTimelineItem-root": {
    "&:before": {
      flex: 0,
      padding: 0,
      content: "none",
    },
  },
  minHeight: "70px",
  marginLeft: "20px",
}));
const ComplaintDetail = ({ ticketId }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const classes = useStyles();
  const [statusLoading, setStatusLoading] = useState(false);
  const [toggleActionModal, setToggleActionModal] = useState(false);
  const [issueStatus, setIssueStatus] = useState()

  // REFS
  const cancelPartialEventSourceResponseRef = useRef(null);
  const onIssueEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  const getTimelines = (data) => {
    // Combine alternately
    const combinedActions = [];
    const maxLength = Math.max(
      data.complainant_actions.length,
      data.respondent_actions.length
    );

    for (let i = 0; i < maxLength; i++) {
      if (i < data.complainant_actions.length) {
        combinedActions.push({
          action: data.complainant_actions[i].complainant_action,
          short_desc: data.complainant_actions[i].short_desc,
          updated_at: data.complainant_actions[i].updated_at,
          updated_by: `${data.complainant_actions[i].updated_by.person.name} (${data.complainant_actions[i].updated_by.org.name})`,
        });
      }
      if (i < data.respondent_actions.length) {
        combinedActions.push({
          action: data.respondent_actions[i].respondent_action,
          short_desc: data.respondent_actions[i].short_desc,
          updated_at: data.respondent_actions[i].updated_at,
          updated_by: `${data.respondent_actions[i].updated_by.person.name} (${data.respondent_actions[i].updated_by.org.name})`,
        });
      }
    }
    setTimeline([...combinedActions]);
  };
  const fetchIssueDetail = async () => {
    if (!ticketId) return;

    try {
      //   dispatch(setIsLoading(true));
      setTimeline([]);
      const response = await getCall(
        `/issueApis/v1/issue?transactionId=${ticketId}`
      );
      //   dispatch(setIsLoading(false));

      if (!response?.issueExistance) {
        setIsError(true);
        CustomToaster("error", "No issue exists");
        return;
      }
      setData(response?.issue);
      console.log('response', response.issue?.issue_actions)
      mergeRespondantArrays({ respondent_actions: response?.issue?.issue_actions.respondent_actions, complainant_actions: response?.issue?.issue_actions?.complainant_actions })
      // getTimelines(response?.issue?.issue_actions);
      setIssueStatus(response?.issue_status);
    } catch (error) {
      setIsError(true);
      //   dispatch(setIsLoading(false));
      CustomToaster("error", "No issue exists");
    }
  };

  useEffect(() => {
    fetchIssueDetail();
  }, [ticketId]); // Only include ticketId in the dependency array

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      //   padding: '24px',
      //   backgroundColor: '#f5f5f5',
      minHeight: "100vh",
    },
    card: {
      width: "100%",
    },
    headerFlex: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentFlex: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
    rightAlign: {
      textAlign: "",
    },
    marginTop2: {
      marginTop: "8px",
    },
    marginTop4: {
      marginTop: "16px",
    },
    marginBottom2: {
      marginBottom: "8px",
    },
    marginBottom4: {
      marginBottom: "16px",
    },
    flexGap: {
      display: "flex",
      gap: "16px",
    },
    // header: {
    //     fontSize: '18px',
    //     fontWeight: '600',
    //     padding: '16px 16px 0 16px'
    //   },
    infoContainer: {
      marginBottom: "20px",
    },
    row: {
      display: "flex",
      marginBottom: "8px",
    },
    label: {
      width: "120px",
      // color: '#000',
      fontWeight: "500",
      fontSize: "14px",
    },
    value: {
      // color: '#000',
      fontSize: "14px",
    },
    notice: {
      // color: '#000',
      fontSize: "14px",
      marginTop: "16px",
      marginBottom: "16px",
    },
    tableHeader: {
      display: "flex",
      marginBottom: "8px",
      marginTop: "16px",
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: "8px",
    },
    nameColumn: {
      width: "120px",
      fontWeight: "500",
      fontSize: "14px",
    },
    phoneColumn: {
      width: "120px",
      fontWeight: "500",
      fontSize: "14px",
    },
    emailColumn: {
      flex: 1,
      fontWeight: "500",
      fontSize: "14px",
    },
    cardHeader: {
      paddingTop: "10px",
      paddingBottom: "5px",
      paddingLeft: "10px",
      paddingRight: "10px",
    },
    cardContent: {
      paddingTop: "5px",
      paddingBottom: "10px",
      paddingLeft: "10px",
      paddingRight: "10px",
    },
  };

  function parseDuration(duration) {
    return moment.duration(duration).asMilliseconds();
  }

  const getTimelineColor = (status) => {
    switch (status) {
      case "OPEN":
        return "info";
      case "PROCESSING":
        return "warning";
      case "ESCALATE":
        return "error";
      case "RESOLVED":
        return "success";
      case "CLOSE":
        return "success";
      default:
        return "grey";
    }
  };

  function isShowTakeAction() {
    const lastAction = timeline[timeline.length - 1]?.respondent_action
    if (lastAction === "PROCESSING" || lastAction === "OPEN" || lastAction === "ESCALATE") {
       return compareDateWithDuration(process.env.NEXT_EXPECTED_RESPONSE_TIME ?? 'PT1H', timeline[timeline.length - 1]?.updated_at)
    } else if (lastAction !== "ESCALATE" && timeline.some(x => x.respondent_action === "RESOLVED")) {
        return true
    } else {
        return false
    }
}
const mergeRespondantArrays = (actions) => {
  console.log("actions...",actions);
  let resActions = actions.respondent_actions,
      comActions = actions.complainant_actions?.map(item => { return ({ ...item, respondent_action: item.complainant_action }) }),
      mergedarray = [...comActions, ...resActions]

  mergedarray.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
  console.log("response merged array",mergedarray)
  setTimeline(mergedarray)
}
async function getIssueStatusDetails(message_id) {
  try {
      const response = await 
          getCall(`/issueApis/v1/on_issue_status?messageId=${message_id}`
      );
      cancelPartialEventSourceResponseRef.current = [
          ...cancelPartialEventSourceResponseRef.current,
          response,
      ];
      setStatusLoading(false);
      if (response?.message) {
        // getTimelines(data);
          mergeRespondantArrays({ respondent_actions: response.message.issue?.issue_actions.respondent_actions, complainant_actions: data?.issue_actions?.complainant_actions })
          CustomToaster('success','Complaint status updated successfully!');
      } else {
          CustomToaster('error',
              "Something went wrong!, issue status cannot be fetched"
          );
      }
  } catch (err) {
      setStatusLoading(false);
      CustomToaster('error',err);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          eventSource.close();
          clearTimeout(timer);
      });
  }
}

function fetchIssueStatusThroughEvents(message_id) {
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
  es.addEventListener("on_issue_status", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getIssueStatusDetails(messageId);
  });

  const timer = setTimeout(() => {
      es.close();
      if (cancelPartialEventSourceResponseRef.current.length <= 0) {
          CustomToaster("error",
              "Cannot proceed with you request now! Please try again"
          );
          setStatusLoading(false);
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

const checkIssueStatus = async () => {
  cancelPartialEventSourceResponseRef.current = [];
  setStatusLoading(true);
  try {
      const response = await 
          postCall("/issueApis/v1/issue_status", {
              context: {
                transaction_id: data?.transaction_id,
                  bpp_id: data?.bppId,
                  domain: data?.domain
              },
              message: {
                  issue_id: data?.issueId,
              },
          })
      ;
      //Error handling workflow eg, NACK
      if (response.message && response.message.ack.status === "NACK") {
          setStatusLoading(false);
          CustomToaster("error","Something went wrong");
      } else {
          fetchIssueStatusThroughEvents(response.context?.message_id);
      }
  } catch (err) {
      setStatusLoading(false);
      CustomToaster("error",err);
  }
};
  return (
    <RTL direction="ltr">
      {isError || !data ? (
        <Card>
          <CardContent>
            <Typography variant="h6">No issue found</Typography>
          </CardContent>
        </Card>
      ) : (
        <div style={styles.container}>
          {/* Header Section */}
          <Card style={styles.card}>
            <CardHeader
              style={styles.cardHeader}
              title={
                <div style={styles.headerFlex}>
                  <Typography variant="h6">Issue Id: {data.issueId}</Typography>
                  <Chip
                    label={data.issue_status}
                    color="primary"
                    size="small"
                  />
                </div>
              }
              subheader={`Order Id: ${data.order_details.id}`}
            />
            <CardContent style={styles.cardContent}>
              <div style={styles.contentFlex}>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Issue Raised On:{" "}
                    {new Date(data.created_at).toLocaleString()} |{" "}
                    {data.category}: {data.description.short_desc}
                    {/* Issue Raised On: 30/12/2024 at 04:06pm | FULFILLMENT: Delay in
                  delivery */}
                  </Typography>
                  <Typography variant="h6" style={styles.marginTop4}>
                    {data.order_details.items[0].product.name}
                  </Typography>
                  <Typography>
                    QTY: {data.order_details.items[0].quantity.count} x ₹{" "}
                    {data.order_details.items[0].product.price.value}
                  </Typography>
                  <Typography variant="subtitle1" style={styles.marginTop2}>
                    ₹{" "}
                    {data.order_details.items[0].quantity.count *
                      data.order_details.items[0].product.price.value}
                  </Typography>
                </div>
                <div style={styles.rightAlign}>
                  <Typography variant="body2">
                    Expected response time:
                  </Typography>
                  <Typography variant="subtitle2">
                  {moment(data?.created_at)
                                        .add(parseDuration(process.env.NEXT_EXPECTED_RESPONSE_TIME ?? 'PT1H'), "milliseconds")
                                        .format("hh:mm a, MMMM Do, YYYY")}
                  </Typography>
                  <Typography variant="body2" style={styles.marginTop2}>
                    Expected resolution time:
                  </Typography>
                  <Typography variant="subtitle2">
                  {moment(data?.created_at)
                                        .add(parseDuration(process.env.NEXT_EXPECTED_RESOLUTION_TIME ?? 'P1D'), "milliseconds")
                                        .format("hh:mm a, MMMM Do, YYYY")}
                  </Typography>
                  
                </div>
              </div>
                  {isShowTakeAction() && !timeline.some(x => x.respondent_action === "RESOLVED") ?
                            <Typography variant="h4">No response was given for this issue</Typography>
                            : null
                        }
               <Box component={"div"} className={classes.divider} />
                        <div className={classes.summaryItemActionContainer}>
                            {(!timeline?.some(x => x.respondent_action === "CLOSE")) &&
                                <div className="ms-auto">
                                    <div className="d-flex align-items-center justify-content-center flex-wrap">
                                        {
                                            isShowTakeAction() ?
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    className={classes.helpButton}
                                                    disabled={statusLoading}
                                                    onClick={() => {
                                                        setToggleActionModal(true)
                                                    }}
                                                >
                                                    {statusLoading ? (
                                                      <LoadingOverlay open={statusLoading} />
                                                    ) : (
                                                        "Take Action"
                                                    )}
                                                </Button>
                                                :
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    className={classes.helpButton}
                                                    disabled={statusLoading}
                                                    onClick={() => checkIssueStatus()}
                                                >
                                                    {statusLoading ? (
                                                        <LoadingOverlay open={statusLoading} />
                                                    ) : (
                                                        "Get Status"
                                                    )}
                                                </Button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
            </CardContent>
          </Card>

          {/* Timeline Section */}
          <Card style={styles.card}>
            <CardHeader title="Complaint Timeline" style={styles.cardHeader} />
            <CardContent style={styles.cardContent}>
              <Timeline>
                {timeline.map((item, index) => (
                  <StyledTimelineItem key={index} style={styles.timelineItem}>
                    <TimelineSeparator>
                      <TimelineDot color={getTimelineColor(item.complainant_action || item.respondent_action)} />
                      {index < timeline.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2" color="text.primary">
                        {item.respondent_action || item.respondent_action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.updated_at}
                      </Typography>
                      <Typography variant="body2">{item.short_desc}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Updated by: {item.updated_by?.person?.name},{item.updated_by?.org?.name}
                      </Typography>
                    </TimelineContent>
                  </StyledTimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>

          {/* Resolution Section */}
          <Card style={styles.card}>
            <CardHeader
              title="Resolution"
              style={styles.cardHeader}
              subheader={`Updated on: ${moment(
                (
                  timeline
                    .reverse()
                    .find((obj) => obj.respondent_action === "RESOLVED") || {}
                ).updated_at
              ).format("DD/MM/yy")} at ${moment(
                (
                  timeline
                    .reverse()
                    .find((obj) => obj.respondent_action === "RESOLVED") || {}
                ).updated_at
              ).format("hh:mma")}`}
            />
            <CardContent style={styles.cardContent}>
              <Typography variant="subtitle1" style={styles.marginBottom2}>
                {`Updated by: ${
                  data?.resolution_provider?.respondent_info?.organization?.person
                    ?.name
                }, ${
                  data?.resolution_provider?.respondent_info?.organization?.org?.name.split(
                    "::"
                  )[0]
                }`}
              </Typography>
              <Typography variant="body2" style={styles.marginBottom4}>
                {data?.resolution?.short_desc}
              </Typography>
              <Typography variant="body2" style={styles.marginBottom4}>
                {data?.resolution?.long_desc}
              </Typography>
              <Box style={styles.flexGap}>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Action
                  </Typography>
                  <Typography>{data?.resolution?.action_triggered}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Refund Amount
                  </Typography>
                  <Typography>₹ &nbsp;{data?.resolution?.refund_amount}</Typography>
                </div>
              </Box>
            </CardContent>
          </Card>

          <Card style={styles.card}>
            <CardHeader title="Respondent Details" style={styles.cardHeader} />

            <CardContent style={styles.cardContent}>
              {/* Contact Details */}
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <div style={styles.row}>
                  <Typography style={styles.label}>Phone</Typography>
                  <Typography style={styles.value}>{data?.issue_actions?.respondent_actions[data?.issue_actions.respondent_actions.length - 1]?.updated_by
                                ?.contact?.phone ?? "N/A"}
                        </Typography>
                </div>
                <div style={styles.row}>
                  <Typography style={styles.label}>Email</Typography>
                  <Typography style={styles.value}> {data?.issue_actions?.respondent_actions[data?.issue_actions.respondent_actions.length - 1]?.updated_by
                                ?.contact?.email ?? "N/A"}</Typography>
                </div>
              </div>

              {/* GRO Info Section */}
              <Typography style={{ ...styles.label, marginBottom: "8px" }}>
                Contact info of GRO
              </Typography>
              <Typography style={styles.notice}>
                A Grievance has been raised. The GRO will be reaching out to you
                in 24 hours.
              </Typography>

              {/* GRO Details Table */}
              <div style={styles.tableHeader}>
                <Typography style={styles.nameColumn}>Name</Typography>
                <Typography style={styles.phoneColumn}>Phone</Typography>
                <Typography style={styles.emailColumn}>Email</Typography>
              </div>
              <div style={styles.tableHeader}>
                <Typography style={styles.nameColumn}>{'NA'}</Typography>
                <Typography style={styles.phoneColumn}>{'NA'}</Typography>
                <Typography style={styles.emailColumn}>{'NA'}</Typography>
              </div>
              {/* Empty row for data - can be populated when needed */}
            </CardContent>
          </Card>
        </div>
      )}
      {toggleActionModal && (
      <CustomerActionCard
          supportActionDetails={data}
          onClose={() => setToggleActionModal(false)}
          onSuccess={(actionData) => {
              CustomToaster('success',actionData[0].respondent_action === "ESCALATE" ? "GRO would be reaching out to you soon" : "Action successfully taken");
              setToggleActionModal(false);
              console.log("issue Action taken", actionData)
              setTimeline([...timeline, ...actionData])
              actionData[0].respondent_action === "CLOSE" && setIssueStatus('Close')
          }}
      />
  )}
    </RTL>
    
  );
};

export default ComplaintDetail;
