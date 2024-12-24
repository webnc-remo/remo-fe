import { useState, useEffect } from 'react';
import { People } from '../../interface/people.interface';
import { axiosInstance, getPeopleDetailUrl } from '..';
import { message } from 'antd';

interface PeopleDetailResponse {
  item: People;
}

export const usePeopleDetail = (peopleId: string) => {
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState<People>();

  useEffect(() => {
    const fetchPeopleDetail = async () => {
      if (!peopleId) return;

      setLoading(true);
      try {
        const url = getPeopleDetailUrl(peopleId);
        const response = await axiosInstance.get<PeopleDetailResponse>(url);

        if (response.data) {
          setPeople(response.data.item);
        }
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).response?.data?.message ||
          'Failed to search movies. Please try again!';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPeopleDetail();
  }, [peopleId]);

  return { people, loading };
};
