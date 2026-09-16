// WhatsApp Integration Utility
export const generateWhatsAppMessage = (
  propertyTitle?: string,
  location?: string,
  price?: string,
  customMessage?: string
): string => {
  if (customMessage) return customMessage;
  
  let message = 'Hello De-Greenacres, ';
  
  if (propertyTitle) {
    message += `I'm interested in ${propertyTitle}`;
    if (location) message += `, ${location}`;
    if (price) message += `, listed at ${price}`;
    message += '. Please provide more information.';
  } else {
    message += 'I would like to inquire about your properties.';
  }
  
  return encodeURIComponent(message);
};

export const getWhatsAppUrl = (
  phoneNumber: string = '2347041754800',
  propertyTitle?: string,
  location?: string,
  price?: string,
  customMessage?: string
): string => {
  const message = generateWhatsAppMessage(propertyTitle, location, price, customMessage);
  return `https://wa.me/${phoneNumber}?text=${message}`;
};

// Format price for WhatsApp
export const formatPriceForWhatsApp = (price: number, period?: string): string => {
  if (price >= 1000000000) {
    return `₦${(price / 1000000000).toFixed(1)}B${period ? `/${period}` : ''}`;
  } else if (price >= 1000000) {
    return `₦${(price / 1000000).toFixed(0)}M${period ? `/${period}` : ''}`;
  } else if (price >= 1000) {
    return `₦${(price / 1000).toFixed(0)}K${period ? `/${period}` : ''}`;
  }
  return `₦${price.toLocaleString()}${period ? `/${period}` : ''}`;
};
