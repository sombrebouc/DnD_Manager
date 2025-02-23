import axios from 'axios';

const apiBaseURL = 'https://www.dnd5eapi.co/api';

export const fetchRaces = async () => {
  const response = await axios.get(`${apiBaseURL}/races`);
  return response.data.results;
};

export const fetchClasses = async () => {
  const response = await axios.get(`${apiBaseURL}/classes`);
  return response.data.results;
};
