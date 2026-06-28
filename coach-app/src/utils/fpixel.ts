export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1040603791955800';

export const pageview = () => {
  if (typeof window !== 'undefined') {
    const fbq = (window as any).fbq;
    if (fbq && typeof fbq === 'function') {
      const params = new URLSearchParams(window.location.search);
      const testCode = params.get('test_event_code');
      if (testCode) {
        fbq('set', 'testEventCode', testCode);
      }
      fbq('track', 'PageView');
    } else {
      setTimeout(() => pageview(), 250);
    }
  }
};

export const event = (name: string, options: any = {}) => {
  if (typeof window !== 'undefined') {
    const fbq = (window as any).fbq;
    if (fbq && typeof fbq === 'function') {
      const params = new URLSearchParams(window.location.search);
      const testCode = params.get('test_event_code') || (window as any)._metaTestCode;
      if (testCode) {
        (window as any)._metaTestCode = testCode;
        fbq('set', 'testEventCode', testCode);
      }
      console.log(`[MetaPixel] Track event: ${name}`, options);
      fbq('track', name, options);
    } else {
      setTimeout(() => event(name, options), 250);
    }
  }
};
