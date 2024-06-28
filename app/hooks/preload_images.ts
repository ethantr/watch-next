import { useState, useEffect } from 'react';

const usePreloadImages = (urls: string[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoaded(false);
    const images = urls.map(url => {
      const img = new Image();
      img.src = url;
      return img;
    });

    Promise.all(images.map(img => {
      return new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
    })).then(() => {
      if (isMounted) setLoaded(true);
    }).catch(() => {
      if (isMounted) setLoaded(false);
    });

    return () => {
      isMounted = false;
    };
  }, [urls]);

  return loaded;
};

export default usePreloadImages