import axios from "axios";

const API_URL = "http://localhost:1337";

export async function listLogEntries() {
  const { data } = await axios.get(`${API_URL}/api/logs`);
  return data;
}

const options = {
  headers: {
    "content-type": "application/json",
  },
};

export async function createLogEntry(entry) {
  const { data } = await axios.post(`${API_URL}/api/logs`, entry, options);
  return data;
}
