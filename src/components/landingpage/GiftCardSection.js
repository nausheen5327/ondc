import React from 'react';
import CustomContainer from '../container';
import CustomImageContainer from '../CustomImageContainer';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import gift_image from "../../../public/static/gift.svg"
const GiftCardSection = ({giftCards}) => {
const theme = useTheme();
  return (
    <CustomContainer>
        <div style={{
            marginTop:'30px',
            marginBottom:'20px'
        }}>
       <Stack direction="row" alignItems="center" paddingBottom="20px" paddingInlineStart="5px" spacing={1}>
                            <CustomImageContainer
                                src={gift_image.src}
                                width="26px"
                                height="26px"
                            />
                            <Typography
                                fontSize={{ xs: "20px", md: "20px" }}
                                fontWeight={{ xs: "500", md: "700" }}
                                color={theme.palette.neutral[1000]}
                            >
                                Popular Gift Cards
                            </Typography>

                        </Stack>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {giftCards.map((card, index) => (
          <div key={index} style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          >
            {/* Image Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '120px'
            }}>
              <img 
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${card.image.url}`}
                alt={card.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Offer Banner */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '0',
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '0 4px 4px 0',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: '1'
              }}>
                {card.offer}
              </div>
            </div>

            {/* Content */}
            <div style={{
              padding: '16px'
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333333',
                lineHeight: '1.4'
              }}>
                {card.title}
              </h3>
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#666666',
                lineHeight: '1.5',
                whiteSpace: 'nowrap'
              }}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </CustomContainer>
  );
};

export default GiftCardSection;