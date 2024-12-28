export const addSearchParamToUrl = (
  searchParam: Array<{ key: string; value: string | number | null }>
) => {
  const url = new URL(location.href);
  searchParam.forEach((param) => {
    if (param.value && param.value !== '') {
      url.searchParams.set(param.key, param.value.toString());
    } else {
      url.searchParams.delete(param.key);
    }
  });

  return url.pathname + '?' + url.searchParams.toString();
};
