import React, { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import styles from './style.module.scss';

const Picker = ({ title, value, onValueChange, min = 0, max = 1000, step = 1 }) => {
  // State for the previous, current, and next values
  const [prevValue, setPrevValue] = useState(value - step);
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value + step);
  // State for animation class
  const [animationClass, setAnimationClass] = useState('');

  // Update internal state when props change
  useEffect(() => {
    setCurrentValue(value);
    setPrevValue(value - step);
    setNextValue(value + step);
  }, [value, step]);

  // Function to update values based on direction (next or previous)
  const updateValues = useCallback((direction) => {
    // Set animation class based on direction
    setAnimationClass(direction === 'next' ? styles.slideUp : styles.slideDown);
    
    setTimeout(() => {
      if (direction === 'next' && currentValue < max) {
        // Move to next value
        setPrevValue(currentValue);
        setCurrentValue(nextValue);
        setNextValue(nextValue + step);
        onValueChange(nextValue);
      } else if (direction === 'prev' && currentValue > min) {
        // Move to previous value
        setNextValue(currentValue);
        setCurrentValue(prevValue);
        setPrevValue(prevValue - step);
        onValueChange(prevValue);
      }
      // Clear animation class
      setAnimationClass('');
    }, 200); // Animation duration
  }, [currentValue, prevValue, nextValue, min, max, step, onValueChange]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => updateValues('next'),
    onSwipedDown: () => updateValues('prev'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className={styles.numb} {...swipeHandlers}>
      <div className={`${styles.prevValue} ${animationClass}`}>{prevValue}</div>
      <div className={`${styles.currentValue} ${animationClass}`}>{currentValue}</div>
      <div className={`${styles.nextValue} ${animationClass}`}>{nextValue}</div>
      <div className={styles.pickerTitle}>
        {title}
      </div>
    </div>
  );
};

export default React.memo(Picker);

//the last version:
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { useSwipeable } from 'react-swipeable';
// import styles from './style.module.scss';

// const Picker = ({ title, arr, value, onValueChange }) => {
//   // Index of the current value in the array
//   const [currentIndex, setCurrentIndex] = useState(0);
//   // CSS class for animation
//   const [animationClass, setAnimationClass] = useState('');

//   // Update currentIndex when value or arr changes
//   useEffect(() => {
//     const index = arr.indexOf(value);
//     if (index !== -1) {
//       setCurrentIndex(index);
//     }
//   }, [arr, value]);

//   // Calculate previous and next values
//   const prevValue = useMemo(() => arr[(currentIndex - 1 + arr.length) % arr.length], [arr, currentIndex]);
//   const nextValue = useMemo(() => arr[(currentIndex + 1) % arr.length], [arr, currentIndex]);

//   // Handle value change (next or previous)
//   const handleChange = useCallback((direction) => {
//     // Set animation class based on direction
//     setAnimationClass(direction === 'next' ? styles.slideUp : styles.slideDown);
    
//     setTimeout(() => {
//       // Calculate new index
//       setCurrentIndex(prevIndex => {
//         const newIndex = direction === 'next'
//           ? (prevIndex + 1) % arr.length
//           : (prevIndex - 1 + arr.length) % arr.length;
        
//         // Update parent component
//         onValueChange(arr[newIndex]);
//         return newIndex;
//       });
//       setAnimationClass('');
//     }, 200); // Animation duration
//   }, [arr, onValueChange]);

//   // Swipe handlers
//   const swipeHandlers = useSwipeable({
//     onSwipedUp: () => handleChange('next'),
//     onSwipedDown: () => handleChange('prev'),
//     preventDefaultTouchmoveEvent: true,
//     trackMouse: true
//   });

//   return (
//     <div className={styles.numb} {...swipeHandlers}>
//       <div className={`${styles.prevValue} ${animationClass}`}>{prevValue}</div>
//       <div className={`${styles.currentValue} ${animationClass}`}>{arr[currentIndex]}</div>
//       <div className={`${styles.nextValue} ${animationClass}`}>{nextValue}</div>
//       <div className={styles.pickerTitle}>
//         {title}
//       </div>
//     </div>
//   );
// };

// export default React.memo(Picker);


//PREVIOUS

// import React, { useState, useEffect } from 'react';
// import { useSwipeable } from 'react-swipeable';
// import styles from './style.module.scss';

// export default function Picker({ title = "Title", arr, value, onValueChange }) {
//   // Index of the current value in the array
//   const [currentValueIndex, setCurrentValueIndex] = useState(0);
//   // CSS class for animation
//   const [animationClass, setAnimationClass] = useState('');

//   // Update currentValueIndex when value or arr changes
//   useEffect(() => {
//     const updatedValueIndex = arr.indexOf(value);
//     if (updatedValueIndex !== -1) {
//       setCurrentValueIndex(updatedValueIndex);
//     }
//   }, [arr, value]);

//   // Handle value change (next or previous)
//   const handleChange = (direction) => {
//     // Set animation class based on direction
//     setAnimationClass(direction === 'next' ? styles.slideUp : styles.slideDown);
    
//     setTimeout(() => {
//       // Calculate new index
//       const newIndex = direction === 'next' 
//         ? (currentValueIndex + 1) % arr.length 
//         : (currentValueIndex - 1 + arr.length) % arr.length;
      
//       // Update state and parent component
//       setCurrentValueIndex(newIndex);
//       onValueChange(arr[newIndex]);
//       setAnimationClass('');
//     }, 200); // Animation duration
//   };

//   // Swipe handlers
//   const swipeHandlers = useSwipeable({
//     onSwipedUp: () => handleChange('next'),
//     onSwipedDown: () => handleChange('prev'),
//     preventDefaultTouchmoveEvent: true,
//     trackMouse: true
//   });

//   // Calculate values for display
//   const prevArrValue = arr[(currentValueIndex - 1 + arr.length) % arr.length];
//   const currentValue = arr[currentValueIndex];
//   const nextArrValue = arr[(currentValueIndex + 1) % arr.length];

//   return (
//     <div className={styles.numb} {...swipeHandlers}>
//       <div className={`${styles.prevValue} ${animationClass}`}>{prevArrValue}</div>
//       <div className={`${styles.currentValue} ${animationClass}`}>{currentValue}</div>
//       <div className={`${styles.nextValue} ${animationClass}`}>{nextArrValue}</div>
//       <div className={styles.pickerTitle}>
//         {title}
//       </div>
//     </div>
//   );
// }















//OLD:
// import React, { useState, useEffect } from 'react';
// import { useSwipeable } from 'react-swipeable';
// import styles from './style.module.scss';

// export default function Picker({ title = "Title", arr, value, onValueChange }) {

//   //position of the current value in the array
//   const [currentValueIndex, setCurrentValueIndex] = useState(0);
//   const [animationClass, setAnimationClass] = useState('');


//   // updates the current index value to match the
//   // position of the current value in the array
//   // when the value or array changes
//   useEffect(() => {
//     const updatedValueIndex = arr.indexOf(value);
//     if (updatedValueIndex !== -1) {
//       setCurrentValueIndex(updatedValueIndex);
//     }
//   }, [arr, value]);

//   const handleNext = () => {
//     setAnimationClass(styles.slideUp);
//     setTimeout(() => {
//       const nextValueIndex = (currentValueIndex + 1) % arr.length;
//       setCurrentValueIndex(nextValueIndex);
//       onValueChange(arr[nextValueIndex]);
//       setAnimationClass('');
//     }, 300);
//   };

//   const handlePrev = () => {
//     setAnimationClass(styles.slideDown);
//     setTimeout(() => {
//       const prevValueIndex = (currentValueIndex - 1 + arr.length) % arr.length;
//       setCurrentValueIndex(prevValueIndex);
//       onValueChange(arr[prevValueIndex]);
//       setAnimationClass('');
//     }, 300);
//   };

//   const handleSwipe = useSwipeable({
//     onSwipedUp: (eventData) => {
//       eventData.event.preventDefault();
//       eventData.event.stopPropagation();
//       handleNext();
//     },
//     onSwipedDown: (eventData) => {
//       eventData.event.preventDefault();
//       eventData.event.stopPropagation();
//       handlePrev();
//     }
//   });

//   const prevArrValue= arr[(currentValueIndex - 1 + arr.length) % arr.length];
//   const nextArrValue= arr[(currentValueIndex + 1) % arr.length];

//   return (
//     <div className={styles.numb} {...handleSwipe}>
//       <div className={`${styles.prevValue} ${animationClass}`}>{prevArrValue}</div>
//       <div className={`${styles.currentValue} ${animationClass}`}>{arr[currentValueIndex]}</div>
//       <div className={`${styles.nextValue} ${animationClass}`}>{nextArrValue}</div>
//       <div className={styles.pickerTitle}>
//         {title}
//       </div>
//     </div>
//   );
// }