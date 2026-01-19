import axios from "axios";
import xml2js from "xml2js";

export const fetchJobsFromAPI = async (url) => {
  const res = await axios.get(url);
  const json = await xml2js.parseStringPromise(res.data, {
    explicitArray: false
  });
  // console.log(res,'res')
  return json.rss.channel.item || [];
};
