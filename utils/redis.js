/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import sha1 from 'sha1';
import { Request } from 'express';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from './db';
import redisClient from './redis';

/**
 * Fetches the user from the Authorization header in the given request object.
 * @param {Request} req The Express request object.
 * @returns {Promise<{_id: ObjectId, email: string, password: string}>}
 */
export const getUserFromAuthorization = async (req) => {
  const authHeader = req.headers.authorization || null;

  if (!authHeader) {
    return null;
  }
  const authParts = authHeader.split(' ');

  if (authParts.length !== 2 || authParts[0] !== 'Basic') {
    return null;
  }
  const decodedToken = Buffer.from(authParts[1], 'base64').toString();
  const separatorPosition = decodedToken.indexOf(':');
  const userEmail = decodedToken.substring(0, separatorPosition);
  const userPassword = decodedToken.substring(separatorPosition + 1);
  const userData = await (await dbClient.usersCollection()).findOne({ email: userEmail });

  if (!userData || sha1(userPassword) !== userData.password) {
    return null;
  }
  return userData;
};

/**
 * Fetches the user from the X-Token header in the given request object.
 * @param {Request} req The Express request object.
 * @returns {Promise<{_id: ObjectId, email: string, password: string}>}
 */
export const getUserFromXToken = async (req) => {
  const authToken = req.headers['x-token'];

  if (!authToken) {
    return null;
  }
  const userIdFromRedis = await redisClient.get(`auth_${authToken}`);
  if (!userIdFromRedis) {
    return null;
  }
  const userData = await (await dbClient.usersCollection())
    .findOne({ _id: new mongoDBCore.BSON.ObjectId(userIdFromRedis) });
  return userData || null;
};

export default {
  getUserFromAuthorization: async (req) => getUserFromAuthorization(req),
  getUserFromXToken: async (req) => getUserFromXToken(req),
};
