import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../index';

test('it should validate length', async () => {
  const { findByLabelText, findByText, findByRole } = render(<Home />);
  const input = await findByLabelText('Password');

  fireEvent.input(input, { target: { value: 'qwerty' } });
  fireEvent.submit(await findByRole('button'));

  const error = await findByText('must be 8 chars')
  expect(error).toBeInTheDocument()
});

test('it should validate complexity', async () => {
  const { findByLabelText, findByText, findByRole } = render(<Home />);
  const input = await findByLabelText('Password');

  fireEvent.input(input, { target: { value: 'asfdasdfsadasdf' } });
  fireEvent.submit(await findByRole('button'));

  const error = await findByText(/must include lower/)
  expect(error).toBeInTheDocument()
});
