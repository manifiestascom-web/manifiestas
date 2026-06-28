export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1040603791955800';

export const initFbq = () => {
  if (typeof window !== 'undefined') {
    if (!(window as any).fbq) {
      const fbq: any = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      if (!(window as any)._fbq) (window as any)._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      (window as any).fbq = fbq;
    }
  }
};

export const pageview = () => {
  if (typeof window !== 'undefined') {
    initFbq();
    (window as any).fbq('track', 'PageView');
  }
};

export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined') {
    initFbq();
    console.log(`[MetaPixel] Track event: ${name}`, options);
    (window as any).fbq('track', name, options);
  }
};
