import { baseUrl } from "@/globalurl/baseurl";
import axios from "axios";

export const useGetFormList = async ({
  page,
  pageSize,
  keyword,
}: {
  page: number;
  pageSize: number;
  keyword: string;
}) => {
  try {
    const response = await axios.get(`${baseUrl}/api/contact-form/getforms`, {
      params: {
        page: page,
        pageSize: pageSize,
        keyword: keyword,
      },
    });
    console.log(response.data); // log the response data
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch form list" };
  }
};
