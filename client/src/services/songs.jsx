import { useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const fetchSongs = async () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const response = await fetchData(
    "/song",
    "GET",
    undefined,
    userCtx.accessToken
  );

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  return response.data;
};

export default songs;
