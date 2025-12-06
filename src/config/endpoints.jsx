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
    GET_ITEMS_BY_SHOP: "/items",
    SEARCH_BY_NAME: "/items/search/name",
    SEARCH_BY_ADDRESS: "/items/search/address",
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
    UPDATE_SHOP_INFO: "/shops/my-shop",
    TOGGLE_SHOP_STATUS: "/shops/my-shop/status",
  },
};

export default ENDPOINTS;
