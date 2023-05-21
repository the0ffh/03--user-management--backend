import { TestCase } from './TestCase';

describe('TestCase', () => {
  it('should create and destroy database', async () => {
    console.log = jest.fn();
    const testCase = new TestCase();

    await testCase.setup();
    expect(console.log).toHaveBeenLastCalledWith(
      `database ${testCase.getDatabaseName()} created`,
    );
    await testCase.destroy();
    expect(console.log).toHaveBeenLastCalledWith(
      `database ${testCase.getDatabaseName()} dropped`,
    );
  });
});
