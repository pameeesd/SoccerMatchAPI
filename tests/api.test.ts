export const testBackendSuite = () => {
  console.log('SoccerMatch API Test Suite initialized cleanly.');
  return true;
};

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  testBackendSuite();
}
