import { expect, it, describe, vi } from 'vitest';
import { render } from '@testing-library/react';

import { Header } from '../src/components/header/header';

describe('Header', () => {
  it('should render header', () => {
    const { getByText } = render(<Header action={() => {}} />);
    expect(getByText('+ Create new note')).toBeDefined();
  });
  it('should click on element', async () => {
    const callback = vi.fn().mockImplementation(() => {});
    const { getByText } = render(<Header action={callback} />);
    const button = getByText('+ Create new note');
    expect(button).toBeDefined();
    await button.click();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
