import { baseUrl } from "@/globalurl/baseurl";
import axios from "axios";

interface BlogType {
  title: string;
  description: string;
}
export const createBlog = async ({ title, description }: BlogType) => {
  try {
    const response = await axios.post(`${baseUrl}/api/blog/blogs`, {
      title,
      description,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "Failed to create blog" };
  }
};

export const useGetBlogList = async ({
  page,
  pageSize,
  keyword,
}: {
  page: number;
  pageSize: number;
  keyword: string;
}) => {
  try {
    const response = await axios.get(`${baseUrl}/api/blog/getallblogs`, {
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
    return { error: "Failed to fetch blog list" };
  }
};

// export const getLanguageList = async ({
//   page,
//   pageSize,
//   keyword = "",
// }: {
//   page: number;
//   pageSize: number;
//   keyword: string;
// }) => {
//   return await customAxios.get<languageResponse>(
//     languageRoutes.getLanguageList,
//     {
//       params: { page, pageSize, keyword },
//     }
//   );
// };
