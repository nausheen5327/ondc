import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heart_image from '../../../public/static/heart.svg'
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import CustomImageContainer from '../CustomImageContainer';

const styles = {
  container: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '0 20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#ffffff'  // White text
  },
  scrollContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  imageList: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '5px 0',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
  },
  imageCard: {
    flex: '0 0 auto',
    width: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    transition: 'transform 0.2s ease',
  },
  image: {
    width: '100%',
    height: '80px',
    objectFit: 'cover',
  },
  imageInfo: {
    padding: '12px',
  },
//   title: {
//     fontSize: '16px',
//     fontWeight: 'bold',
//     marginBottom: '4px',
//     color: '#374151',
//   },
  description: {
    fontSize: '14px',
    color: '#6b7280',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: '1px solid rgba(229, 231, 235, 0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1,
    transition: 'all 0.2s ease',
  },
  prevButton: {
    left: 0,
  },
  nextButton: {
    right: 0,
  }
};

const BrandSlider = ({brands}) => {
  const scrollRef = useRef(null);


  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300; // Adjust this value to control scroll distance
    
    if (container) {
      const newScrollPosition = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
        
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      .image-list::-webkit-scrollbar {
        display: none;
      }
      
      /* Hover effect for cards */
      .image-card:hover {
        transform: translateY(-4px);
      }

      /* Hover effect for navigation buttons */
      .nav-button:hover {
        background-color: #f3f4f6;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
const theme = useTheme();
  return (
    <div style={styles.container}>
       <Stack direction="row" alignItems="center" paddingBottom="20px" paddingInlineStart="5px" spacing={1}>
                            <CustomImageContainer
                                src={heart_image.src}
                                width="26px"
                                height="26px"
                            />
                            <Typography
                                fontSize={{ xs: "20px", md: "20px" }}
                                fontWeight={{ xs: "500", md: "700" }}
                                color={theme.palette.neutral[1000]}
                            >
                                Most Loved Brands
                            </Typography>

                        </Stack>
      <button 
        style={{...styles.navButton, ...styles.prevButton}}
        onClick={() => scroll('left')}
        className="nav-button"
        aria-label="Scroll left"
      >
        <ChevronLeft size={10} />
      </button>

      <div style={styles.scrollContainer}>
        <div 
          ref={scrollRef}
          style={styles.imageList}
          className="image-list"
        >
          {brands?.map((brand,index) => (
            <div 
              key={index}
              style={styles.imageCard}
              className="image-card"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${brand.image.url}`}
                alt={brand.title}
                style={styles.image}
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        style={{...styles.navButton, ...styles.nextButton}}
        onClick={() => scroll('right')}
        className="nav-button"
        aria-label="Scroll right"
      >
        <ChevronRight size={10} />
      </button>
    </div>
  );
};

export default BrandSlider;