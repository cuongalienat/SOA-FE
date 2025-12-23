const ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auths/signup",
    SIGNIN: "/auths/signin",
    VERIFY: "/auths/verify",
    RESET_PASSWORD: "/auths/reset-password",
    RESEND_VERIFICATION: "/auths/resend-verification",
    SIGNIN_GOOGLE: "/auths/google",
  },
  ITEM: {
    GET_ALL_ITEMS: "/items",
    GET_BY_ID: "/items/:id",
    CREATE: "/items",
    UPDATE: "/items/:id",
    DELETE: "/items/:id",
  },
  ORDER: {
    CREATE_ORDER: "/orders",
    GET_USER_ORDERS: "/orders/myOrders",
    CANCEL_ORDER: "/orders/:id/cancel",
    GET_SHOP_ORDERS: "/orders/manage",
    UPDATE_STATUS: "/orders/:id/status",
    GET_ORDER_DETAILS: "/orders/:id",
  },
  DELIVERY: {
    CREATE: "/deliveries",
    GET_DETAILS: "/deliveries/:id",
    ACCEPT: "/deliveries/:id/accept",
    UPDATE_STATUS: "/deliveries/:id/status",
  },
  SHOP: {
    GET_ALL: "/shops",
    CREATE: "/shops",
    GET_MY_SHOP: "/shops/my-shop",
    GET_MY_SHOP_DASHBOARD: "/shops/my-shop/dashboard",
    UPDATE_SHOP_INFO: "/shops/my-shop",
    TOGGLE_SHOP_STATUS: "/shops/my-shop/status",
    GET_BY_ID: "/shops/:id",
  },
  USER: {
    GET_USER_INFO: "/users",
    UPDATE_USER_INFO: "/users",
    DELETE_USER: "/users",
  },
  WALLET: {
    GET_WALLET: "/wallets",
    CREATE_WALLET: "/wallets",
    WITHDRAW: "/wallets/withdraw",
    DEPOSIT: "/wallets/deposit",
    GET_HISTORY: "/wallets/history",
  },
  SHIPPING: {
    CALCULATE_FEE: "/shippings/calculate",
  },
  CATEGORY: {
    GET_BY_ID: "/categories/:id",
    GET_ALL: "/categories",
    CREATE: "/categories",
    UPDATE: "/categories/:id",
    DELETE: "/categories/:id",
  },
};

export default ENDPOINTS;
