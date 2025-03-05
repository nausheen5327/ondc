import React from 'react';
import CustomContainer from '../container';
import { Stack, Typography } from '@mui/material';
import CustomImageContainer from '../CustomImageContainer';
import fire_image from '../../../public/static/fire.svg'
import { useTheme } from '@emotion/react';

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#121212', // Dark background
    minHeight: '100%'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#ffffff'  // White text
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  couponCard: {
    backgroundColor: '#1E1E1E', // Slightly lighter than background
    borderRadius: '18px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    padding: '0px',
    border: '2px solidrgb(0, 0, 0)',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#6366f1',
      transform: 'translateY(-2px)'
    },
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  discount: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#818cf8' // Indigo for contrast
  }
};

const DealsComponent = ({ title, image }) => (
  <div style={{
    position: 'relative',
    width: '100%',
    height:'180px'
  }}>
    <img 
      src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image[0].url}`}
      alt={title}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
    </div>
);

const Deals = ({deals}) => {
  console.log("deals are",deals);
  
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width: 768px) {
        .coupon-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
      }
      
      @media (min-width: 1024px) {
        .coupon-grid {
          grid-template-columns: repeat(4, 1fr) !important;
        }
      }

      /* Add hover effect */
      .coupon-card:hover {
        border-color: #6366f1;
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
const theme = useTheme();
  return (
    <CustomContainer>
    {/* <div style={styles.container}> */}
    <Stack direction="row" alignItems="center" paddingBottom="20px" paddingInlineStart="5px" spacing={1}>
                            <CustomImageContainer
                                src={fire_image.src}
                                width="26px"
                                height="26px"
                            />
                            <Typography
                                fontSize={{ xs: "20px", md: "20px" }}
                                fontWeight={{ xs: "500", md: "700" }}
                                color={theme.palette.neutral[1000]}
                            >
                                Deals for you
                            </Typography>

                        </Stack>
      <div className="coupon-grid" style={styles.grid}>
        {deals.map((deal) => (
          <DealsComponent
            title={deal.title}
            image={deal.image}
          />
        ))}
      </div>
    {/* </div> */}
    </CustomContainer>
  );
};

export default Deals;