import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import styles from './style.module.scss';

export default function Picker({ title = "Title", arr,specificValue
  // , currentValue, setCurrentValue
}) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState(arr[0]);
  const [prevValue, setPrevValue] = useState(arr[arr.length - 1]);
  const [nextValue, setNextValue] = useState(arr[1]);
  const [animationClass, setAnimationClass] = useState('');



  useEffect(() => {
    // Update currentIndex if the currentValue matches specificValue
    const newIndex = arr.indexOf(specificValue);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
      setCurrentValue(arr[newIndex]);
    }
  }, [arr, specificValue]);

  useEffect(() => {
    setPrevValue(arr[(currentIndex - 1 + arr.length) % arr.length]);
    setNextValue(arr[(currentIndex + 1) % arr.length]);
  }, [currentIndex]);

  const handleNext = () => {
    setAnimationClass(styles.slideUp);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % arr.length;
      setCurrentIndex(nextIndex);
      setCurrentValue(arr[nextIndex]);
      setAnimationClass('');
    }, 300);
  };

  const handlePrev = () => {
    setAnimationClass(styles.slideDown);
    setTimeout(() => {
      const prevIndex = (currentIndex - 1 + arr.length) % arr.length;
      setCurrentIndex(prevIndex);
      setCurrentValue(arr[prevIndex]);
      setAnimationClass('');
    }, 300);
  };

  const handleSwipe = useSwipeable({
    onSwipedUp: (eventData) => {
      eventData.event.preventDefault();
      eventData.event.stopPropagation();
      handleNext();
    },
    onSwipedDown: (eventData) => {
      eventData.event.preventDefault();
      eventData.event.stopPropagation();
      handlePrev();
    }
  });

  return (
    <div className={styles.numb} {...handleSwipe}>
      <div className={`${styles.prevValue} ${animationClass}`}>{prevValue}</div>
      <div className={`${styles.currentValue} ${animationClass}`}>{currentValue}</div>
      <div className={`${styles.nextValue} ${animationClass}`}>{nextValue}</div>
      <div className={styles.pickerTitle}>
        {title}
      </div>
    </div>
  );
}
