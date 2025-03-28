// import React, { useEffect, useRef, useState } from "react";
// import FoodCampaign from "./food-campaign/FoodCampaign";
// import BestReviewedFood from "./food-campaign/best-reviewed-foods/BestReviewedFood";
// import NearbyPopularFood from "./new-popular-food/NearbyPopularFood";
// import { Stack } from "@mui/system";
// import { styled, Tab, Tabs } from "@mui/material";
// import { t } from "i18next";
// import { mockData } from "./mockData";
// import { useTheme } from "@emotion/react";
// import { foodTabData } from "./foodTabData";
// import useScrollSticky from "./Search-filter-tag/useScrollSticky";
// import ScrollSpy from "react-ui-scrollspy";
// import { useSelector } from "react-redux";
// import { getAllProductRequest, getRandomData } from "@/api/productApi";
// import { useRouter } from "next/router";
// import { CustomToaster } from "../custom-toaster/CustomToaster";
// import { postCallTest } from "@/api/MainApi";


// export const CustomHomeTab = styled(Tabs)(
//   ({ theme, marginBottom, marginTop }) => ({
//     color: "none",
//     borderBottom: `1px solid ${theme.palette.borderBottomBg}`,
//     zIndex: 9,
//     '& .MuiButtonBase-root': {
//       paddingInlineEnd: '10px',
//       paddingInlineStart: '10px',
//       '& .MuiTabScrollButton-root': {

//         width: 20,
//       },
//     },
//     '& .MuiTabs-flexContainer': {
//       gap: '10px',
//     },
//     '& .MuiTabScrollButton-root': {
//       width: 20,

//     },
//     '& .MuiTabs-indicator': {
//       display: 'none',
//     },


//   })
// )
// const DifferentFoodCompontent = ({ isLoading, isLoadingNearByPopularRestaurantData }) => {
//   const [activeSection, setActiveSection] = useState(foodTabData[0]?.value);
//   const parentScrollContainerRef = useRef(null);
//   const theme = useTheme()
//   const { foodOffsetElementRef } = useScrollSticky();
//   const { restaurantIsSticky } = useSelector((state) => state.scrollPosition)
//   const [filterType, setFilterType] = useState(null)
//   const [shouldUpdateActiveSection, setShouldUpdateActiveSection] = useState(true);
//   const updateActiveSection = () => {
//     if (!shouldUpdateActiveSection) return;
    
//     const section1 = document.getElementById(foodTabData[0]?.value);
//     const section2 = document.getElementById(foodTabData[1]?.value);
//     const section3 = document.getElementById(foodTabData[2]?.value);

//     if (section3 && window.scrollY + 200 >= section3.offsetTop) {
//       setActiveSection(foodTabData[2]?.value);
//     } else if (section2 && window.scrollY + 300 >= section2.offsetTop) {
//       setActiveSection(foodTabData[1]?.value);
//     } else if (section1 && window.scrollY + 300 >= section1.offsetTop) {
//       setActiveSection(foodTabData[0]?.value);
//     }
//   };
//   const handleChange = (event, newValue) => {
//     setActiveSection(newValue); // Directly update activeSection when tab is clicked
//     setShouldUpdateActiveSection(false);
//     scrollToSection(newValue);
//   };

//   const handleScroll = () => {
//     updateActiveSection();
//   };

//   const scrollToSection = (sectionId) => {
//     const target = document.getElementById(sectionId);
//     if (target) {
//       const headerOffset = 150;
//       const elementPosition = target.getBoundingClientRect().top + window.scrollY;
//       const offsetPosition = elementPosition - headerOffset;

//       window.scroll({
//         top: offsetPosition,
//         behavior: "smooth",
//       });
      
//       // Re-enable scroll-based updates after the scroll animation completes
//       setTimeout(() => {
//         setShouldUpdateActiveSection(true);
//       }, 1000); // Adjust timeout based on scroll animation duration
//     }
//   };
//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [shouldUpdateActiveSection]);


//   // API to get popular items //
//   const router = useRouter();
//   const [type, setType] = useState('all')
//   const [name, setName] = useState('pizza')
//   const [products, setProducts] = useState([])
//   const [totalProductCount, setTotalProductCount] = useState(0)
 
//   const { global } = useSelector((state) => state.globalSettings)
//   const [offset, setOffset] = useState(1)
//   const [page_limit, setPageLimit] = useState(10)
//   const [trendPageData, setTrendPageData] = useState({})

//   const [popularPageData, setPopularPageData] = useState({})

//   const [bestReviewpageData, setBestReviewPageData] = useState({})
  
//   const [paginationModel, setPaginationModel] = useState({
//     page: 1,
//     pageSize: 10,
//     searchData: [],
//   })
//   const [campaignIsloading, setCampaignIsloading] = useState(false)

//   const storeDataBySection=(section,data)=>{
//       switch(section) {
//         case 'todays-trends':
//           setTrendPageData(data)
//           return;
//         case 'popular-foods':
//           setPopularPageData(data);
//           return;
//         case 'best-reviewed':
//           setBestReviewPageData(data);
//           return;
//         default:
//           return ;
//       }
//   }

//   const getAllProducts = async (searchName, currentOffset,activeSection) => {
//     // Check if data is already cached
//     setCampaignIsloading(true);
//     try {
//       const paginationData = {
//         ...paginationModel,
//         page: currentOffset,
//         searchData: {
//           ...paginationModel.searchData.reduce((r, e) => ({
//             ...r,
//             [e.code]: e.selectedValues.join()
//           }), {}),
//           pageNumber: currentOffset,
//           limit: paginationModel.pageSize,
//           name: searchName
//         }
//       }

//       const data = await
//         getAllProductRequest(paginationData.searchData)
//       // Cache the results
      
//       // setProducts(prevProducts => [...prevProducts, ...data.data])
//       // setTotalProductCount(data.count)
//      storeDataBySection(activeSection,data.data);
//       setCampaignIsloading(false);
//     } catch (err) {
//       setCampaignIsloading(false);
//       CustomToaster('error', err)
//     }
//   }

//    const getRandomData = async () => {
//         try {
//             let location = localStorage.getItem('location');
//             let latitude = null;
//             let longitude = null;
//             if(location)
//             {
//                 latitude = JSON.parse(location).address.lat;
//                 longitude = JSON.parse(location).address.lng;
//             }            
//             const data = await postCallTest(`/clientApis/v2/getRandomItems`, {lat:latitude, lon:longitude});            
//             storeDataBySection('todays-trends',data?.data)
//         } catch (err) {
//             console.log("error fetching data", err);
            
//         }
// }


//   useEffect(() => {
//     type && setOffset(1)
//   }, [type])
//   useEffect(() => {
//     // getAllProducts('pizza', offset,'todays-trends');
//     getRandomData();
//     getAllProducts('burger', offset,'popular-foods');
//     getAllProducts('chicken', offset,'best-reviewed');
//   }, []);

//   //

//   return (
//     <Stack marginTop="30px">
//       <Stack sx={{
//         position: "sticky",
//         top: { xs: "90px", md: "108px" },
//         zIndex: 9,
//         background: theme => theme.palette.neutral[1800]
//       }}>
//         <CustomHomeTab
//           value={filterType}
//           onChange={handleChange}
//           variant="scrollable"
//           allowScrollButtonsMobile
//         >
//            {foodTabData?.map((item) => {
//             return (
//               <Tab
//                 key={item?.id}
//                 value={item.value}
//                 sx={{
//                   fontWeight: activeSection === item?.value ? "700" : "400",
//                   transition: "all 0.2s",
//                   borderBottom: activeSection === item?.value ? "2px solid" : "none",
//                   borderColor: activeSection === item?.value ? theme => theme.palette.primary.main : "none",
//                   color: activeSection === item?.value ? theme => theme.palette.primary.main : (theme) =>
//                     theme.palette.customColor?.six,
//                   '&.Mui-selected': {
//                     color: activeSection === item?.value ? theme => theme.palette.primary.main : (theme) =>
//                       theme.palette.customColor?.six,
//                   },
//                 }}
//                 label={t(item?.category_name)}
//               />
//             )
//           })}
//         </CustomHomeTab>
//       </Stack>
//       <div ref={parentScrollContainerRef}>
//         <ScrollSpy>
//           <div id={foodTabData[0]?.value}>
//             {Object.keys(trendPageData).length > 0 && <FoodCampaign data={trendPageData} isLoading={campaignIsloading} />}
//           </div>
//           <div id={foodTabData[1]?.value}>
//             {Object.keys(popularPageData).length > 0 &&<NearbyPopularFood popularFood={popularPageData} isLoading={campaignIsloading} />
//             }          </div>
//           <div id={foodTabData[2]?.value}>
//            {Object.keys(bestReviewpageData).length > 0 && <BestReviewedFood bestReviewedFoods={bestReviewpageData} isLoading={campaignIsloading} />}
//           </div>
//         </ScrollSpy>
//       </div>
//     </Stack>
//   );
// };

// export default DifferentFoodCompontent;


import React, { useEffect, useRef, useState } from "react";
import FoodCampaign from "./food-campaign/FoodCampaign";
import BestReviewedFood from "./food-campaign/best-reviewed-foods/BestReviewedFood";
import NearbyPopularFood from "./new-popular-food/NearbyPopularFood";
import { Stack } from "@mui/system";
import { styled, Tab, Tabs } from "@mui/material";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import { foodTabData } from "./foodTabData";
import useScrollSticky from "./Search-filter-tag/useScrollSticky";
import ScrollSpy from "react-ui-scrollspy";
import { useSelector } from "react-redux";
import { getAllProductRequest } from "@/api/productApi";
import { useRouter } from "next/router";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import { postCallTest } from "@/api/MainApi";

export const CustomHomeTab = styled(Tabs)(
  ({ theme, marginBottom, marginTop }) => ({
    color: "none",
    borderBottom: `1px solid ${theme.palette.borderBottomBg}`,
    zIndex: 9,
    '& .MuiButtonBase-root': {
      paddingInlineEnd: '10px',
      paddingInlineStart: '10px',
      '& .MuiTabScrollButton-root': {

        width: 20,
      },
    },
    '& .MuiTabs-flexContainer': {
      gap: '10px',
    },
    '& .MuiTabScrollButton-root': {
      width: 20,

    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  })
)

const DifferentFoodCompontent = ({ isLoading, isLoadingNearByPopularRestaurantData }) => {
  const theme = useTheme()
  const { foodOffsetElementRef } = useScrollSticky();
  const { restaurantIsSticky } = useSelector((state) => state.scrollPosition)
  const [filterType, setFilterType] = useState(null)
  const [shouldUpdateActiveSection, setShouldUpdateActiveSection] = useState(true);
  const parentScrollContainerRef = useRef(null);
  
  // Data state for each section
  const [trendPageData, setTrendPageData] = useState({})
  const [popularPageData, setPopularPageData] = useState({})
  const [bestReviewpageData, setBestReviewPageData] = useState({})
  
  // Create a filtered version of the foodTabData based on available data
  const [availableTabs, setAvailableTabs] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  
  // Update available tabs whenever the data changes
  useEffect(() => {
    const tabs = foodTabData.filter(tab => {
      if (tab.value === 'todays-trends' && Object.keys(trendPageData).length > 0) return true;
      if (tab.value === 'popular-foods' && Object.keys(popularPageData).length > 0) return true;
      if (tab.value === 'best-reviewed' && Object.keys(bestReviewpageData).length > 0) return true;
      return false;
    });
    
    setAvailableTabs(tabs);
    
    // Set active section to the first available tab if not already set
    if (tabs.length > 0 && (!activeSection || !tabs.some(tab => tab.value === activeSection))) {
      setActiveSection(tabs[0].value);
    }
  }, [trendPageData, popularPageData, bestReviewpageData, activeSection]);

  const updateActiveSection = () => {
    if (!shouldUpdateActiveSection || availableTabs.length === 0) return;
    
    // Get all available sections from filtered tabs
    const availableSections = availableTabs.map(tab => tab.value);
    
    // Check each section in reverse order (to prioritize later sections when scrolling down)
    for (let i = availableSections.length - 1; i >= 0; i--) {
      const section = document.getElementById(availableSections[i]);
      if (section && window.scrollY + 200 >= section.offsetTop) {
        setActiveSection(availableSections[i]);
        break;
      }
    }
  };

  const handleChange = (event, newValue) => {
    setActiveSection(newValue);
    setShouldUpdateActiveSection(false);
    scrollToSection(newValue);
  };

  const handleScroll = () => {
    updateActiveSection();
  };

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 150;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scroll({
        top: offsetPosition,
        behavior: "smooth",
      });
      
      // Re-enable scroll-based updates after the scroll animation completes
      setTimeout(() => {
        setShouldUpdateActiveSection(true);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldUpdateActiveSection, availableTabs]);

  // API related state
  const router = useRouter();
  const [type, setType] = useState('all')
  const [offset, setOffset] = useState(1)
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
    searchData: [],
  })
  const [campaignIsloading, setCampaignIsloading] = useState(false)

  const storeDataBySection = (section, data) => {
    switch(section) {
      case 'todays-trends':
        setTrendPageData(data);
        return;
      case 'popular-foods':
        setPopularPageData(data);
        return;
      case 'best-reviewed':
        setBestReviewPageData(data);
        return;
      default:
        return;
    }
  }

  const getAllProducts = async (searchName, currentOffset, activeSection) => {
    setCampaignIsloading(true);
    try {
      const paginationData = {
        ...paginationModel,
        page: currentOffset,
        searchData: {
          ...paginationModel.searchData.reduce((r, e) => ({
            ...r,
            [e.code]: e.selectedValues.join()
          }), {}),
          pageNumber: currentOffset,
          limit: paginationModel.pageSize,
          name: searchName
        }
      }

      const data = await getAllProductRequest(paginationData.searchData);
      storeDataBySection(activeSection, data.data);
      setCampaignIsloading(false);
    } catch (err) {
      setCampaignIsloading(false);
      CustomToaster('error', err);
    }
  }

  const getRandomData = async () => {
    try {
      let location = localStorage.getItem('location');
      let latitude = null;
      let longitude = null;
      // if(location) {
      //   latitude = JSON.parse(location).address.lat;
      //   longitude = JSON.parse(location).address.lng;
      // }      
      // const data = await postCallTest(`/clientApis/v2/getRandomItems`, {lat:latitude, lon:longitude});            
      // storeDataBySection('todays-trends', data?.data);
    } catch (err) {
      console.log("error fetching data", err);
    }
  }

  useEffect(() => {
    type && setOffset(1);
  }, [type]);
  
  // Initial data loading
  useEffect(() => {
    getRandomData(); // For todays-trends
    getAllProducts('burger', offset, 'popular-foods');
    getAllProducts('chicken', offset, 'best-reviewed');
  }, []);

  // Only render the tabs section if we have at least one tab with data
  return (
    <Stack marginTop="30px">
      {availableTabs.length > 0 && (
        <Stack sx={{
          position: "sticky",
          top: { xs: "90px", md: "108px" },
          zIndex: 9,
          background: theme => theme.palette.neutral[1800]
        }}>
          <CustomHomeTab
            value={activeSection}
            onChange={handleChange}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            {availableTabs.map((item) => (
              <Tab
                key={item?.id}
                value={item.value}
                sx={{
                  fontWeight: activeSection === item?.value ? "700" : "400",
                  transition: "all 0.2s",
                  borderBottom: activeSection === item?.value ? "2px solid" : "none",
                  borderColor: activeSection === item?.value ? theme => theme.palette.primary.main : "none",
                  color: activeSection === item?.value ? theme => theme.palette.primary.main : (theme) =>
                    theme.palette.customColor?.six,
                  '&.Mui-selected': {
                    color: activeSection === item?.value ? theme => theme.palette.primary.main : (theme) =>
                      theme.palette.customColor?.six,
                  },
                }}
                label={t(item?.category_name)}
              />
            ))}
          </CustomHomeTab>
        </Stack>
      )}

      <div ref={parentScrollContainerRef}>
        <ScrollSpy>
          {Object.keys(trendPageData).length > 0 && (
            <div id={foodTabData[0]?.value}>
              <FoodCampaign data={trendPageData} isLoading={campaignIsloading} />
            </div>
          )}
          
          {Object.keys(popularPageData).length > 0 && (
            <div id={foodTabData[1]?.value}>
              <NearbyPopularFood popularFood={popularPageData} isLoading={campaignIsloading} />
            </div>
          )}
          
          {Object.keys(bestReviewpageData).length > 0 && (
            <div id={foodTabData[2]?.value}>
              <BestReviewedFood bestReviewedFoods={bestReviewpageData} isLoading={campaignIsloading} />
            </div>
          )}
        </ScrollSpy>
      </div>
    </Stack>
  );
};

export default DifferentFoodCompontent;