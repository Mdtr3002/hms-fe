import { API_URL } from '../config';
import { axios } from '../utils/custom-axios';

import type { Material } from '../types/material';
import type { Response } from '../types/response';

type GetAllMaterialArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
};
type GetAllMaterialReturnType = {
  total: number;
  result: Material[];
};
const getAll = (query: GetAllMaterialArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}material?pagination=false\
${query.name ? `&name=${query.name}` : ''}
${query.subject ? `&subject=${query.subject}` : ''}
${query.chapter ? `&chapter=${query.chapter}` : ''}`;

  return axios.get<Response<GetAllMaterialReturnType>>(queryString);
};

type GetAllMaterialPaginatedArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
  pageNumber?: number;
  pageSize?: number;
};
type EditArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
  description?: string;
};
type GetAllMaterialPaginatedReturnType = {
  total: number;
  pageSize: number;
  pageCount: number;
  result: Material[];
};
const getAllPaginated = (query: GetAllMaterialPaginatedArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}material?pagination=true\
${query.name ? `&name=${query.name}` : ''}\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.chapter ? `&chapter=${query.chapter}` : ''}\
${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}`;

  return axios.get<Response<GetAllMaterialPaginatedReturnType>>(queryString);
};

const download = (materialId: string, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}material/${materialId}/download`;

  return axios.get(queryString, { responseType: 'blob' });
};

const getById = (materialId: string, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}material/${materialId}`;

  return axios.get<Response<Material>>(queryString);
};

const edit = (materialId: string, queryBody: EditArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}material/${materialId}`;

  return axios.patch<Response<Material>>(queryString, queryBody);
};
const create = (data: FormData) => {
  return axios.post<Response<Material>>(`${API_URL}admin/material`, data);
};

const deleteById = (materialId: string) => {
  return axios.delete(`${API_URL}admin/material/${materialId}`);
};

const MaterialService = {
  getAll,
  getAllPaginated,
  download,
  getById,
  edit,
  create,
  deleteById,
};
export default MaterialService;
