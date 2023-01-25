// utils
import { removeTrailingSlash } from '../../utils';

const BASE_URL_ENV = import.meta.env.VITE_STATUS_INFO_API_BASE_URL;

export const STATUS_INFO_API_BASE_URL = BASE_URL_ENV
  ? removeTrailingSlash(BASE_URL_ENV)
  : 'http://0.0.0.0:5747';
