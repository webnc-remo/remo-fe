import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { axiosInstance, getSharedListUrl } from '..';
import { Movie } from '../../interface/movie.interface';

interface SharedListParams {
  listId: string;
  page?: number;
  take?: number;
  order?: 'asc' | 'desc';
}

interface SharedListResponse {
  items: Movie[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  list: {
    id: string;
    listName: string;
    createdAt: string;
    user: {
      fullname: string;
    };
  };
}

export const useGetSharedList = ({
  listId,
  page = 1,
  take = 10,
  order = 'asc',
}: SharedListParams) => {
  const { data, isLoading, refetch } = useQuery<SharedListResponse>({
    queryKey: ['sharedList', listId, page, take, order],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(getSharedListUrl(listId), {
          params: {
            page,
            take,
            order,
          },
        });
        return response.data;
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).message || 'Failed to fetch shared list';
        message.error(errorMessage);
        throw error;
      }
    },
    enabled: !!listId,
  });

  return {
    movies: data?.items,
    meta: data?.meta,
    listInfo: data?.list,
    loading: isLoading,
    refetch,
  };
};
