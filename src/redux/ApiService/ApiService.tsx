const DEFAULT_TIMEOUT = 30000;

export const getRequest = async (url: string, timeout = DEFAULT_TIMEOUT) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      throw new Error(
        'Request timed out. Please check your internet connection.',
      );
    }
    console.error('GET API ERROR →', error);
    throw error;
  }
};

export const postRequest = async (
  url: string,
  body: any,
  timeout = DEFAULT_TIMEOUT,
) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      throw new Error(
        'Request timed out. Please check your internet connection.',
      );
    }
    console.error('POST API ERROR →', error);
    throw error;
  }
};
