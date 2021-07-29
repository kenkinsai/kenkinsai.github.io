global.rootRequire = global.rootRequire || function () { return { default: {} } }
const Admin = global.rootRequire('components/admin').default
const noteComponent = global.rootRequire('components/admin/note').default
const cateComponent = global.rootRequire('components/admin/cate').default
const productcateComponent = global.rootRequire('components/admin/productcate').default
const productComponent = global.rootRequire('components/admin/product').default
const reviewComponent = global.rootRequire('components/admin/review').default
const orderComponent = global.rootRequire('components/admin/order').default
const dashboardComponent = global.rootRequire('components/admin/dashboard').default

const userComponent = global.rootRequire('components/admin/rbac/user').default
const roleComponent = global.rootRequire('components/admin/rbac/role').default
const permissionComponent = global.rootRequire('components/admin/rbac/permission').default
const loginComponent = global.rootRequire('components/authenticate/login').default
const registerComponent = global.rootRequire('components/authenticate/register').default
// [[RX_ROUTES_IMPORT]] //
let adminRoutes = { path: '/admin', component: Admin, routes: [{ path: '/admin', component: dashboardComponent, exact: true }] }
adminRoutes.routes = adminRoutes.routes.concat([{ path: '/admin/dashboard', component: dashboardComponent }])
adminRoutes.routes = adminRoutes.routes.concat([{ path: '/admin/cate', component: cateComponent }])
adminRoutes.routes = adminRoutes.routes.concat([{ path: '/admin/note', component: noteComponent }])
adminRoutes.routes = adminRoutes.routes.concat([{ path: '/admin/productcate', component: productcateComponent }])
adminRoutes.routes = adminRoutes.routes.concat([{ path: '/admin/product', component: productComponent }])
adminRoutes.routes = adminRoutes.routes.concat([{ path: '/admin/review', component: reviewComponent }])
adminRoutes.routes = adminRoutes.routes.concat([{ path: '/admin/order', component: orderComponent }])

// [[RX_ROUTES_admin]] //
let Modulroutes = []; Modulroutes = Modulroutes.concat([adminRoutes])

let rxgenrbacRoutes = { path: '/rbac', component: Admin, routes: [{ path: '/rbac', component: noteComponent, exact: true }] }
rxgenrbacRoutes.routes = rxgenrbacRoutes.routes.concat([{ path: '/rbac/user', component: userComponent }])
rxgenrbacRoutes.routes = rxgenrbacRoutes.routes.concat([{ path: '/rbac/role', component: roleComponent }])
rxgenrbacRoutes.routes = rxgenrbacRoutes.routes.concat([{ path: '/rbac/permission', component: permissionComponent }])
let loginRoutes = { path: '/login', component: loginComponent }
let registerRoutes = { path: '/register', component: registerComponent }
// [[RX_ROUTES_RBAC]] //
Modulroutes = Modulroutes.concat([rxgenrbacRoutes, loginRoutes, registerRoutes])
// [[RX_ROUTES]] //
module.exports = Modulroutes
