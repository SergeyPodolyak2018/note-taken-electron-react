import React, { useEffect } from 'react';
export const useOutsideClick = (
  callback: () => void,
  ref: React.RefObject<HTMLDivElement>
) => {
  const handleClick = (event: MouseEvent) => {
    //@ts-ignore
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 1000);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};
