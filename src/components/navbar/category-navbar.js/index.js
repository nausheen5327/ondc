// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {  setCategoriesList } from '@/redux/slices/global';
// import { getCallStrapi } from '@/api/MainApi';
// import { CustomToaster } from '@/components/custom-toaster/CustomToaster';
// import styled from '@emotion/styled';
// import styles from './CategoryMenu.module.css';
// import { useRouter } from 'next/router';

// const MenuWrapper = styled('div')({
//   width: '100%',
//   backgroundColor: '#1E1E1E',
//   padding: '6px 0',
//   height: '64px',
// });


// const CategoriesNavigation = ({categories}) => {
  
  

//   if (!categories?.length) {
//     return null; 
//   }

//   const router = useRouter();

//   const CategoryItem = ({ category }) => (
//     <button 
//       className={styles.categoryItem}
//       aria-label={`Select ${category.title} category`}
//       onClick={()=>router.push(`/home?category=${category.title}`)}
//     >
//       <div className={styles.iconWrapper}>
//         <img 
//           src={`${category.imageSrc}`} 
//           alt={`${category.title} icon`}
//         />
//       </div>
//       <span className={styles.categoryName}>
//         {category.title}
//       </span>
//     </button>
//   );

//   return (
//     <MenuWrapper>
//       <div className={styles.menuWrapper}>
//         <div className={styles.categoryContainer}>
//           <div className={styles.categoryGrid}>
//             {categories.map((category) => (
//               <CategoryItem 
//                 key={category.id || category.title}
//                 category={category}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </MenuWrapper>
//   );
// };

// export default CategoriesNavigation;
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoriesList } from '@/redux/slices/global';
import { getCallStrapi } from '@/api/MainApi';
import styled from '@emotion/styled';
import styles from './CategoryMenu.module.css';
import { useRouter } from 'next/router';

// Styled components
const MenuWrapper = styled('div')({
  width: '100%',
  backgroundColor: '#1E1E1E',
  padding: '6px 0',
  height: '64px',
});

// Loader component for Suspense fallback
const CategorySkeleton = () => (
  <MenuWrapper>
    <div className={styles.menuWrapper}>
      <div className={styles.categoryContainer}>
        <div className={styles.categoryGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className={styles.categoryItem}
              style={{
                opacity: 0.5,
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            >
              <div className={styles.iconWrapper}></div>
              <span className={styles.categoryName}></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </MenuWrapper>
);

// Lazily loaded CategoryItem component
const CategoryItem = lazy(() => 
  Promise.resolve({
    default: ({ category }) => {
      const router = useRouter();
      
      const handleCategoryClick = () => {
        router.push(`/home?category=${category.title}`);
      };
      
      return (
        <button 
          className={styles.categoryItem}
          aria-label={`Select ${category.title} category`}
          onClick={handleCategoryClick}
        >
          <div className={styles.iconWrapper}>
            <img 
              src={`${category.imageSrc}`} 
              alt={`${category.title} icon`}
              loading="lazy" // Add native lazy loading for images
            />
          </div>
          <span className={styles.categoryName}>
            {category.title}
          </span>
        </button>
      );
    }
  })
);

const CategoriesNavigation = ({ categories }) => {
  const router = useRouter();
  
  // Implement intersection observer for lazy loading
  useEffect(() => {
    // This will only run on client side
    if (typeof window !== 'undefined') {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Load all images within the container when it becomes visible
            const images = entry.target.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
              // This triggers browser's native lazy loading
              img.setAttribute('loading', 'eager');
            });
            
            // Unobserve once loaded
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      // Start observing the category container
      const categoryContainer = document.querySelector(`.${styles.categoryContainer}`);
      if (categoryContainer) {
        observer.observe(categoryContainer);
      }
      
      return () => {
        if (categoryContainer) {
          observer.unobserve(categoryContainer);
        }
      };
    }
  }, [categories]);

  if (!categories?.length) {
    return null;
  }

  return (
    <MenuWrapper>
      <div className={styles.menuWrapper}>
        <div className={styles.categoryContainer}>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <Suspense 
                key={category.id || category.title} 
                fallback={
                  <div className={styles.categoryItem} style={{ opacity: 0.5 }}>
                    <div className={styles.iconWrapper}></div>
                    <span className={styles.categoryName}></span>
                  </div>
                }
              >
                <CategoryItem category={category} />
              </Suspense>
            ))}
          </div>
        </div>
      </div>
    </MenuWrapper>
  );
};

// Export a dynamic import function for the parent component to use
export const DynamicCategoriesNavigation = () => {
  const categories = useSelector(state => state.globalSettings.categoriesList);
  
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoriesNavigation categories={categories} />
    </Suspense>
  );
};

export default CategoriesNavigation;