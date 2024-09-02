// utils/api.ts
import axios from 'axios';

export async function apiRequest(url: string, method: string, data?: any) {
  let accessToken = localStorage.getItem('accessToken');

  const config = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Access Token이 만료되었을 가능성이 있으므로, 갱신 시도
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);

        // 새로운 Access Token으로 요청 재시도
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        const retryResponse = await axios(config);
        return retryResponse.data;
      } else {
        // Refresh Token 갱신 실패 시 로그인 페이지로 리디렉트
        window.location.href = '/login';
      }
    } else {
      // 여기서 error를 any로 타입캐스팅하여 사용
      console.error('Error occurred:', (error as any).message);
      throw error;
    }
  }
}

async function refreshAccessToken() {
  const refreshToken = getCookie('refreshToken');

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post('/api/auth/refresh-token', { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error('Access token 갱신 실패:', (error as any).message);
    return null;
  }
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}
