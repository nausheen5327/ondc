import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  setCategoriesList } from '@/redux/slices/global';
import { getCallStrapi } from '@/api/MainApi';
import { CustomToaster } from '@/components/custom-toaster/CustomToaster';
import styled from '@emotion/styled';
import styles from './CategoryMenu.module.css';
import { useRouter } from 'next/router';

const MenuWrapper = styled('div')({
  width: '100%',
  backgroundColor: '#1E1E1E',
  padding: '6px 0',
  height: '64px',
});


const CategoriesNavigation = ({categories}) => {
  
  

  if (!categories?.length) {
    return null; 
  }

  const router = useRouter();

  const CategoryItem = ({ category }) => (
    <button 
      className={styles.categoryItem}
      aria-label={`Select ${category.title} category`}
      onClick={()=>router.push(`/home?category=${category.title}`)}
    >
      <div className={styles.iconWrapper}>
        <img 
          src={`${category.imageSrc}`} 
          alt={`${category.title} icon`}
        />
      </div>
      <span className={styles.categoryName}>
        {category.title}
      </span>
    </button>
  );

  return (
    <MenuWrapper>
      <div className={styles.menuWrapper}>
        <div className={styles.categoryContainer}>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <CategoryItem 
                key={category.id || category.title}
                category={category}
              />
            ))}
          </div>
        </div>
      </div>
    </MenuWrapper>
  );
};

export default CategoriesNavigation;