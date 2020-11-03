import { v4 } from 'uuid'

export const queryIdGenerator = () => {
  return v4().substr(0, 3).replace(/\d/g, 'x')
}

export const sortCorrections = (c1, c2) => {
  if (!c1.createdAt) {
    return -1
  }

  if (c1.createdAt > c2.createdAt) {
    return -1
  }

  if (c1.createdAt === c2.createdAt) {
    return 0
  }

  if (c1.createdAt < c2.createdAt) {
    return 1
  }
}
