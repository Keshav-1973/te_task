import axios from 'axios';

const client = axios.create({
  baseURL: "https://api.spacexdata.com/v3/launches?limit=100"
});


export const getLaunchList = async (launchFilter) => {
  var response = await client.get(
    `/launches?limit=100&launch_success=${launchFilter}`
  );
  return response.status === 200 ? response.data : [];

}
export const getLandList = async (launchFilter, landFilter) => {
  var response = await client.get(
    `/launches?limit=100&launch_success=${launchFilter}&land_success=${landFilter}`
  );
  return response.status === 200 ? response.data : [];

}

export const getAllList = async (launchFilter, landFilter, yearFilter) => {
  var response = await client.get(
    `/launches?limit=100&launch_success=${launchFilter}&land_success=${landFilter}&launch_year=${yearFilter}`
  );
  return response.status === 200 ? response.data : [];
}

export const getInitialData = async () => {
  const response = await client.get("&amp;launch_success=true");
  return response.status === 200 ? response.data : [];
}

