import { usersRoutes } from '../endpoints';

const removeTokenUser = async (request, userId, commonHeaders) => {
  // delete users
  await request.delete(usersRoutes.delete(userId)).set(commonHeaders);
};

export default removeTokenUser;
