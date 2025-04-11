import axios from "axios";

const BASE_URL = "https://bainbites-backend-cf7633e008c8.herokuapp.com"; 

export const pinRestaurant = async (boardId, restaurant) =>
  axios.post(`${BASE_URL}/boards/${boardId}/pin`, restaurant);

export const getBoardPins = async (boardId) =>
  axios.get(`${BASE_URL}/boards/${boardId}`);

export const voteRestaurant = async (boardId, data) =>
  axios.post(`${BASE_URL}/boards/${boardId}/vote`, data);

export const getVotes = async (boardId) =>
  axios.get(`${BASE_URL}/boards/${boardId}/votes`);
