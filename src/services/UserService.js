import { api } from '../config/api';

class UserService {
  async list() {
    const response = await api.get('/users');
    return response.data;
  }

  async get(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await api.post('/users', data);
    return response.data;
  }

  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }

  async loginUser(credentials) {
    const response = await api.post('/users/login', credentials);
    return response.data;
  }

  async getMe() {
    const response = await api.get('/users/me');
    return response.data;
  }
}

const userService = new UserService();
export default userService;
