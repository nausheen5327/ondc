import React from 'react';
import { MapPin, Clock, Phone, Package, Ban, RotateCcw } from 'lucide-react';
import { useTheme } from '@mui/styles';

const RestaurantMDetails = ({ data }) => {
  const getTimings = (timing) => {
    const list = timing?.list || [];
    const timeFrom = list.find(item => item.code === 'time_from')?.value || '';
    const timeTo = list.find(item => item.code === 'time_to')?.value || '';
    return `${timeFrom.slice(0,2)}:${timeFrom.slice(2)} - ${timeTo.slice(0,2)}:${timeTo.slice(2)}`;
  };

  const getDeliveryTiming = () => {
    return data.provider_details.tags.find(tag => 
      tag.code === 'timing' && tag.list.find(item => item.code === 'type' && item.value === 'Delivery')
    );
  };
const theme = useTheme();
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {data.provider_details.descriptor.name}
        </h2>
      </div>
      
      <div className="card-content">
        <div className="info-section">
          <div className="info-item">
            <MapPin className="icon1" height={'35px'} width={'60px'} color='#FF7918'/>
            <span className="text">
              {data.location_details.address.street}, 
              {data.location_details.address.locality}, 
              {data.location_details.address.city} - 
              {data.location_details.address.area_code}
            </span>
          </div>
          
          <div className="info-item">
            <Clock className="icon" height={'20px'} width={'20px'} color='#FF7918'/>
            <span className="text">
              {getTimings(getDeliveryTiming())}
            </span>
          </div>

          <div className="info-item">
            <Phone className="icon" height={'20px'} width={'20px'} color='#FF7918'/>
            <span className="text">
              {data.item_details['@ondc/org/contact_details_consumer_care'].split(',')[2]}
            </span>
          </div>
        </div>

        <div className="delivery-section">
          <div className="info-item">
            <Package className="icon" height={'20px'} width={'20px'} color='#FF7918'/>
            <span className="text">
              Delivery in {data.item_details['@ondc/org/time_to_ship'].replace('PT', '').replace('M', ' mins')}
            </span>
          </div>

          <div className="options-container">
            <div className="info-item">
              <Ban height={'20px'} width={'20px'} color='#FF7918' className={`icon ${data.item_details['@ondc/org/returnable'] ? 'success' : 'error'}`} />
              <span className="text">
                {data.item_details['@ondc/org/returnable'] ? 'Returnable' : 'Non-returnable'}
              </span>
            </div>

            <div className="info-item">
              <RotateCcw height={'20px'} width={'20px'} color='#FF7918'className={`icon ${data.item_details['@ondc/org/cancellable'] ? 'success' : 'error'}`} />
              <span className="text">
                {data.item_details['@ondc/org/cancellable'] ? 'Cancellable' : 'Non-cancellable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          width: 100%;
          background: '#0000009e';
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          padding: 16px;
          border-bottom: 1px solid #eee;
        }

        .card-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0;
        }

        .card-content {
          padding: 16px;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .delivery-section {
          padding-top: 12px;
          border-top: 1px solid #eee;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon {
          width: 20px !important;
          height: 20px !important;
          color: #666;
          flex-shrink: 0;
        }

        .icon1 {
          width: 60px;
          height: 35px;
          color: #666;
          flex-shrink: 0;
        }

        

        .text {
          font-size: 14px;
          color: white;
        }

        .options-container {
          display: flex;
          gap: 24px;
        }

        .success {
          color: #22c55e;
        }

        .error {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default RestaurantMDetails;