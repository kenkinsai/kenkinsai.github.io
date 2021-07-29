const Home = global.rootRequiretheme('home/home').default
const About = global.rootRequiretheme('about/about').default
const Payment = global.rootRequiretheme('payment/payment').default

const ProductAll = global.rootRequiretheme('product/all').default
const ProductSingle = global.rootRequiretheme('product/single').default

const NotFound = global.rootRequiretheme('notFound').default

let Themeroutes = [
  { path: '/',
    exact: true,
    component: Home,
    loadData: 'api_home'
  },
  { path: '/about',
    component: About
  },
  { path: '/payment',
    component: Payment
  },
  { path: '/cate/',
    exact: true,
    component: ProductAll,
    loadData: 'api_site_productcate'
  },
  { path: '/cate/:slug',
    component: ProductAll,
    loadData: 'api_site_productcate'
  },
  { path: '/product/',
    exact: true,
    component: ProductSingle,
    loadData: 'api_site_product'
  },
  { path: '/product/:slug',
    component: ProductSingle,
    loadData: 'api_site_product'
  },
  { path: '*',
    component: NotFound
  }]

export default Themeroutes
