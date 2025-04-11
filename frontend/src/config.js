// config.js
const BASE_URL = "https://bainbites-backend-cf7633e008c8.herokuapp.com";


const ENDPOINTS = {
  GET_BOARDS: `${BASE_URL}/boards`,
  CREATE_BOARD: `${BASE_URL}/boards/create`,
  GET_RECOMMENDATIONS: `${BASE_URL}/recommendations`,
  SUMMARIZE: `${BASE_URL}/summarize`,
  PIN_TO_BOARD: (boardId) => `${BASE_URL}/boards/${boardId}/pin`,
  VOTE_ON_RESTAURANT: (boardId) => `${BASE_URL}/boards/${boardId}/vote`,
};

export default ENDPOINTS;
