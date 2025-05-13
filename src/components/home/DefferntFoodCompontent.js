import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const theme = useTheme();
  const { foodOffsetElementRef } = useScrollSticky();
  const { restaurantIsSticky } = useSelector((state) => state.scrollPosition);
  const { location } = useSelector((state) => state.addressData);
  
  const [filterType, setFilterType] = useState(null);
  const [shouldUpdateActiveSection, setShouldUpdateActiveSection] = useState(true);
  const parentScrollContainerRef = useRef(null);
  
  // Track current location to detect changes
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // Data state for each section
  const [trendPageData, setTrendPageData] = useState({});
  const [popularPageData, setPopularPageData] = useState({});
  const [bestReviewpageData, setBestReviewPageData] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const hasLocationChanged = location && 
  (!currentLocation || 
   location.lat !== currentLocation.lat || 
   location.lng !== currentLocation.lng);


  console.log("location after change hhhhhhhhhhhhhhhh",location );
  

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
  const [type, setType] = useState('all');
  const [offset, setOffset] = useState(1);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
    searchData: [],
  });
  const [campaignIsloading, setCampaignIsloading] = useState(false);

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
  };

  const getAllProducts = useCallback(async (searchName, currentOffset, activeSection) => {
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
      };

      const data = await getAllProductRequest(paginationData.searchData);
      storeDataBySection(activeSection, data.data);
      setCampaignIsloading(false);
    } catch (err) {
      setCampaignIsloading(false);
      // CustomToaster('error', err);
    }
  });

  const getRandomData = useCallback(async (currentLocation) => {
    try {
      // Use location from Redux store if available
      let latitude = null;
      let longitude = null;
      
      if (currentLocation) {
        // Extract location from Redux state
        latitude = currentLocation.lat;
        longitude = currentLocation.lng;
      } else {
        // Fallback to localStorage if Redux state is unavailable
        let localStorageLocation = localStorage.getItem('currentLatLng');
        if (localStorageLocation) {
          const parsedLocation = JSON.parse(localStorageLocation);
          latitude = parsedLocation.lat;
          longitude = parsedLocation.lng;
        }
      }
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhh",location, latitude, longitude)
      const data = await postCallTest(`/clientApis/v2/getRandomItems`, {lat: latitude, lon: longitude});            
      storeDataBySection('todays-trends', data?.data);
    } catch (err) {
      console.log("error fetching data", err);
    }
  });

  // Effect for type changes
  useEffect(() => {
    type && setOffset(1);
  }, [type]);
  
  // Effect for location changes
  useEffect(() => {
    if (hasLocationChanged) {
      setCurrentLocation(location);
      
      // Refresh all data when location changes
      refreshAllData(location);
    }
  }, [location]);
  
  // Initial data loading
  useEffect(() => {
    getRandomData();
    getAllProducts('burger', offset, 'popular-foods');
    getAllProducts('chicken', offset, 'best-reviewed');
  }, []);
  const refreshAllData = useCallback(async (newLocation) => {
    if (isRefreshing) return; // Prevent concurrent refreshes
    
    setIsRefreshing(true);
    setCampaignIsloading(true);
    
    try {
      // Execute all data fetching in parallel for efficiency
      await Promise.all([
        getRandomData(newLocation),
        getAllProducts('burger', offset, 'popular-foods', newLocation),
        getAllProducts('chicken', offset, 'best-reviewed', newLocation)
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      CustomToaster('error', 'Failed to refresh data');
    } finally {
      setCampaignIsloading(false);
      setIsRefreshing(false);
    }
  }, [getRandomData, getAllProducts, offset, isRefreshing]);
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