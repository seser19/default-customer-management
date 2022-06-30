const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  deptName: state => state.user.deptName,
  deptLevel: state => state.user.deptLevel,
  deptId: state => state.user.deptId,
  areaId: state => state.user.areaId,
  areaName: state => state.user.areaName
};
export default getters
