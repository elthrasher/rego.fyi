import { renderHook, act } from '@testing-library/react-hooks';
import React, { ReactNode } from 'react';
import { PayloadsProvider, usePayloadsContext } from './PayloadsProvider';

describe('PayloadsProvider', () => {
  test.each`
    input                                    | prop       | method         | valid
    ${JSON.stringify({ a: true, b: false })} | ${'data'}  | ${'saveData'}  | ${'valid'}
    ${'{a:false'}                            | ${'data'}  | ${'saveData'}  | ${'Invalid JSON'}
    ${'a rego string'}                       | ${'rego'}  | ${'saveRego'}  | ${'valid'}
    ${JSON.stringify({ a: true, b: false })} | ${'token'} | ${'saveToken'} | ${'valid'}
    ${'{a:false'}                            | ${'token'} | ${'saveToken'} | ${'Invalid JSON'}
  `('calling $method expecting $valid', ({ input, prop, method, valid }) => {
    const wrapper = ({ children }: { children: ReactNode }) => <PayloadsProvider>{children}</PayloadsProvider>;
    const { result } = renderHook(() => usePayloadsContext(), { wrapper });

    act(() => {
      const validationCheck = (result.current as any)[method](input);
      expect(validationCheck).toBe(valid);
    });

    expect((result.current as any)[prop]).toEqual(input);
  });

  test('must be within provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <div>{children}</div>;
    const { result } = renderHook(() => usePayloadsContext(), { wrapper });
    expect(result.error?.message).toBe('usePayloadsContext must be used within the PayloadsContext.Provider');
  });

  test.each`
    body                   | httpStatus | status
    ${'the response body'} | ${200}     | ${'ALLOWED'}
    ${undefined}           | ${403}     | ${'DENIED'}
  `('service response $status', async ({ body, httpStatus, status }) => {
    global.fetch = jest.fn().mockResolvedValueOnce({ json: () => body, status: httpStatus } as Response);

    const wrapper = ({ children }: { children: ReactNode }) => <PayloadsProvider>{children}</PayloadsProvider>;
    const { result } = renderHook(() => usePayloadsContext(), { wrapper });

    await act(async () => {
      result.current.sendRequest();
    });

    expect(result.current.status).toEqual(status);
    expect(result.current.responsePayload).toEqual(JSON.stringify(body));
  });

  test('fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce('error!');

    const wrapper = ({ children }: { children: ReactNode }) => <PayloadsProvider>{children}</PayloadsProvider>;
    const { result } = renderHook(() => usePayloadsContext(), { wrapper });

    await act(async () => {
      result.current.sendRequest();
    });

    expect(result.current.status).toEqual('DENIED');
    expect(result.current.responsePayload).toEqual(undefined);
  });
});
