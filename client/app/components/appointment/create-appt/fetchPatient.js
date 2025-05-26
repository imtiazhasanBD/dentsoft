import axios from "axios";
import Cookies from "js-cookie";

export const fetchPatients = async (query) => {
  // If empty query, fetch all patients
  const endpoint = query
    ? `${process.env.NEXT_PUBLIC_PATIENT}?search=${encodeURIComponent(query)}`
    : process.env.NEXT_PUBLIC_PATIENT;

  try {
    const res = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch patients", error);
    return [];
  }
};
