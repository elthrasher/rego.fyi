import React, { createContext, ReactNode, useContext, useState } from 'react';

const baseUrl = 'https://api.rego.fyi';

const dataDefault = JSON.stringify({
  requests: [{ methods: ['GET'], resources: ['/orders'] }],
  permissions: ['start_order', 'view_invoice'],
  subscriptions: ['newsletter'],
});

const regoDefault = `package entitlements

import data.requests
import data.permissions
import data.subscriptions

default allow = false

allow {
    check_entitlements[input]
}

check_entitlements[input] {
    r = requests[_]
    some i; match_with_wildcard(data.permissions, input.permissions[i])
    some j; match_with_wildcard(data.subscriptions, input.subscriptions[j])
    match_with_wildcard(r.methods, input.method)
    match_with_wildcard(r.resources, input.resource)
}

match_with_wildcard(allowed, value) {
    allowed[_] = "*"
}
match_with_wildcard(allowed, value) {
    allowed[_] = value
}`;

const tokenDefault = JSON.stringify({
  permissions: ['start_order'],
  resource: '/orders',
  method: 'GET',
  subscriptions: ['newsletter'],
});

export interface Payloads {
  data: string;
  rego: string;
  token: string;

  method: string;
  resource: string;

  status?: 'ALLOWED' | 'DENIED';
  responsePayload?: string;

  saveData: (data: string) => string;
  saveRego: (data: string) => string;
  saveToken: (data: string) => string;
  sendRequest: () => void;
  updateRequest: (method: string, resource: string) => void;
}

export const PayloadsContext = createContext<Payloads | undefined>(undefined);

export const PayloadsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [data, setData] = useState<string>(dataDefault);
  const [rego, setRego] = useState<string>(regoDefault);
  const [token, setToken] = useState<string>(tokenDefault);

  const [method, setMethod] = useState<string>('GET');
  const [resource, setResource] = useState<string>('/orders');

  const [status, setStatus] = useState<'ALLOWED' | 'DENIED' | undefined>();
  const [responsePayload, setResponsePayload] = useState<string | undefined>();

  const saveData = (data: string): string => {
    setData(data);
    try {
      JSON.parse(data);
      return 'valid';
    } catch (e) {
      return 'Invalid JSON';
    }
  };

  const saveRego = (rego: string): string => {
    setRego(rego);
    return 'valid';
  };

  const saveToken = (data: string): string => {
    setToken(data);
    try {
      JSON.parse(data);
      return 'valid';
    } catch (e) {
      return 'Invalid JSON';
    }
  };

  const updateRequest = (method: string, resource: string) => {
    setMethod(method);
    setResource(resource);
  };

  const sendRequest = async () => {
    const pl = btoa(JSON.stringify({ data, rego, token }));
    try {
      const response = await fetch(`${baseUrl}${resource}`, { headers: { Authorization: `Bearer ${pl}` }, method });
      if (response.status === 200) {
        setStatus('ALLOWED');
        const body = await response.json();
        setResponsePayload(JSON.stringify(body));
      } else {
        setStatus('DENIED');
        setResponsePayload(undefined);
      }
    } catch {
      setStatus('DENIED');
      setResponsePayload(undefined);
    }
  };

  return (
    <PayloadsContext.Provider
      value={{
        data,
        rego,
        token,
        method,
        resource,
        saveData,
        saveRego,
        saveToken,
        sendRequest,
        updateRequest,
        status,
        responsePayload,
      }}
    >
      {children}
    </PayloadsContext.Provider>
  );
};

export const usePayloadsContext = (): Payloads => {
  const payloadsContext = useContext(PayloadsContext);
  if (!payloadsContext) {
    throw new Error('usePayloadsContext must be used within the PayloadsContext.Provider');
  }
  return payloadsContext;
};
