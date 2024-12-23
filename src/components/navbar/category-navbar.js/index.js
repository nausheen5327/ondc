import React from 'react';
import { 
  Smartphone, 
  Pizza, 
  ShoppingBag, 
  ShoppingCart, 
  Gift, 
  Home 
} from 'lucide-react';
import { styled } from '@mui/system'
import styles from './CategoryMenu.module.css';

const CategoryMenu = () => {
  const categories = [
    { icon: <Smartphone size={24} />, name: 'Electronics' },
    { icon: <Pizza size={24} />, name: 'Food' },
    { icon: <ShoppingBag size={24} />, name: 'Fashion' },
    { icon: <ShoppingCart size={24} />, name: 'Grocery' },
    { icon: <Gift size={24} />, name: 'Gift Card' },
    { icon: <Home size={24} />, name: 'Decor' },
  ];
  const MenuWrapper = styled('div')({
    width: '100%',
    backgroundColor: '#1E1E1E',
    padding: '6px 0',
    height: '64px',
});
  return (
    <MenuWrapper>
    <div className={styles.menuWrapper}>
      <div className={styles.categoryContainer}>
        <div className={styles.categoryGrid}>
          {categories.map((category, index) => (
            <button key={index} className={styles.categoryItem}>
              <div className={styles.iconWrapper}>
                {category.icon}
              </div>
              <span className={styles.categoryName}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </MenuWrapper>
  );
};

export default CategoryMenu;