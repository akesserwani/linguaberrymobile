

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
  const rtlPattern = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

  return rtlPattern.test(text);
};


