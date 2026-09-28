import { PREFIX } from "./constants";

const redisKeys = {
  user: (userId: string) => `${PREFIX}:user:${userId}`,
  club: (clubId: string) => `${PREFIX}:club:${clubId}`,
  search: (searchKey: string, page: number) => `${PREFIX}:search:${searchKey}:page:${page}`,
  cache: (key: string) => `${PREFIX}:cache:${key}`,
}as const;

export { redisKeys } ;