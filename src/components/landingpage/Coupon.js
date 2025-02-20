import React from 'react';
import { Scissors } from 'lucide-react';
import CustomContainer from '../container';
import { Stack, Typography } from '@mui/material';
import CustomImageContainer from '../CustomImageContainer';
import { useTheme } from '@emotion/react';
import coupon_image from '../../../public/static/coupon.svg'

const styles = {
  container: {
    padding: '10px',
    backgroundColor: '#121212', // Dark background
    // minHeight: '100vh'
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
    gap: '10px',
  },
  couponCard: {
    backgroundColor: '#1E1E1E', // Slightly lighter than background
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    padding: '16px',
    border: '2px dashed #333333',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#6366f1',
      transform: 'translateY(-2px)'
    }
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
  },
  description: {
    fontSize: '14px',
    color: '#e5e7eb', // Light gray for better readability
    marginBottom: '8px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px'
  },
  code: {
    backgroundColor: '#2D2D2D', // Slightly lighter than card
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#a5b4fc', // Light indigo
    border: '1px solid #404040'
  },
  expiryDate: {
    fontSize: '10px',
    color: '#9ca3af',
    paddingTop:'2px',
    paddingBottom:'2px',// Muted gray
  }
};

const formatDate= (timestamp)=>{
const date = new Date(timestamp);
const shortISTTime = date.toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata'
});

return shortISTTime;
}

const CouponCard = ({ code, discount, description, expiryDate }) => (
  <div style={{
    ...styles.couponCard,
    ':hover': styles.couponCard['&:hover']
  }}>
    <div style={styles.cardHeader}>
      <div style={styles.discount}>{discount}</div>
      <Scissors size={20} color="#6b7280" />
    </div>
    <div style={styles.description}>{description}</div>
    <div style={styles.cardFooter}>
      <div style={styles.code}>{code}</div>
     
    </div>
    <div style={styles.expiryDate}>Expires: {formatDate(expiryDate)}</div>
  </div>
);

const CouponGrid = ({coupons}) => {
 

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
        <div style={{
            marginTop:'30px',
            marginBottom:'20px',
        }}>
      <Stack direction="row" alignItems="center" paddingBottom="20px" paddingInlineStart="5px" spacing={1}>
                            <CustomImageContainer
                                src={coupon_image.src}
                                width="30px"
                                height="30px"
                            />
                            <Typography
                                fontSize={{ xs: "20px", md: "20px" }}
                                fontWeight={{ xs: "500", md: "700" }}
                                color={theme.palette.neutral[1000]}
                            >
                                Exclusive Coupons
                            </Typography>

                        </Stack>
      <div className="coupon-grid" style={styles.grid}>
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.code}
            code={coupon.code}
            discount={coupon.title}
            description={coupon.description}
            expiryDate={coupon.expiry}
          />
        ))}
      </div>
      </div>
      </CustomContainer>
  );
};

export default CouponGrid;