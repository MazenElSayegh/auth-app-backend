export const CommonHelper = {
  getRandomValue(startRange: number, endRange: number): number {
    return Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
  },
};
