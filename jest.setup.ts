process.on('unhandledRejection', (reason) => {
  console.error('Jest has found an unhandled exception!');
  fail(reason);
});

expect.addSnapshotSerializer({
  serialize: (val) => JSON.stringify({ ...val, S3Key: '[HASH REMOVED].zip' }),
  test: (val) => val && Object.prototype.hasOwnProperty.call(val, 'S3Key'),
});
