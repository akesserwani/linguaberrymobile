

//Link for the api
export const apiLink = (code) =>{
  // const link = `http://127.0.0.1:8000/creator/${code}/user_data_json`
  const link = `https://linguaberry.com/creator/${code}/user_data_json`;
  return link
}

export const apiKey = "6c8c4520-2fd6-41f2-b5df-d723c063efb8";

//load in Json Array for language arrays 

export const languagesSupported = ["Arabic", "Dutch", "French", "German", "Greek", "Hebrew", "Hindi", "Italian", "Korean", "Portuguese", "Russian", "Spanish", "Swedish", "Turkish"];

export const RTLlanguages = ["Arabic", "Hebrew"];

export const isRTLChar = (text) => {
  // Regular expression to detect Arabic, Hebrew, and other RTL characters
  // Unicode ranges for RTL and Semitic scripts
  const rtlAndSemiticRanges = [
    /[\u0590-\u05FF]/, // Hebrew block
    /[\u0700-\u074F]/, // Syriac (used for Aramaic)
    /[\u0750-\u077F]/, // Supplemental Aramaic (Syriac Supplement)
    /[\uFB1D-\uFB4F]/, // Hebrew Presentation Forms
    /[\u0600-\u06FF]/, // Arabic block
    /[\u08A0-\u08FF]/  // Arabic Extended-A
  ];

  return rtlAndSemiticRanges.some((range) => range.test(text));
};


