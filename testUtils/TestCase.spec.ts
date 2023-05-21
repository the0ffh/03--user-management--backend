import { TestCase } from './TestCase';

describe('TestCase', () => {
  it('should create and destroy database', async () => {
    console.log = jest.fn();
    const testCase = new TestCase('la_baguette');

    await testCase.setup();
    expect(console.log).toHaveBeenLastCalledWith(
      'database la_baguette created',
    );
    await testCase.destroy();
    expect(console.log).toHaveBeenLastCalledWith(
      'database la_baguette dropped',
    );
  });
});
