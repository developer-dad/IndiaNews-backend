const API_KEY = [
  process.env.API1,
  process.env.API2,
  process.env.API3,
  process.env.API4,
];

let currentKeyIndex = 0;

export const getApiKey = () => {
  return API_KEY[currentKeyIndex];
};

export const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
};