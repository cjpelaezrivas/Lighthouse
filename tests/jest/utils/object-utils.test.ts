import { fileUtils } from '../../../src/utils/file-utils';

describe('when convertPath is invoked', () => {
  test('Windows path separators are replaced', () => {
    expect(fileUtils.convertPath(`path\\to\\replace`)).toBe(`path/to/replace`);
  });

  test('Linux path separators are kept', () => {
    expect(fileUtils.convertPath(`path/to/keep`)).toBe(`path/to/keep`);
  });
});
