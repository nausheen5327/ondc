import { getCall } from "./MainApi";



export const getCartItems = async (user) => {
  const url = `/clientApis/v2/cart/${user.localId}`;
  const res = await getCall(url);
  return res;
};
