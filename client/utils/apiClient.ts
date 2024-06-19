import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { NEXT_PUBLIC_API_BASE_PATH } from './envValues';

export const apiAxios = axios.create({ withCredentials: true });

export const apiClient = api(aspida(apiAxios, { baseURL: NEXT_PUBLIC_API_BASE_PATH }));
