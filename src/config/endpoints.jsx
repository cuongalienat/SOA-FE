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
  },
  ORDER: {
    CREATE_ORDER: "/orders",
    GET_USER_ORDERS: "/orders/myOrders",
    CANCEL_ORDER: "/orders/:id/cancel",
    GET_SHOP_ORDERS: "/orders/manage",
    UPDATE_STATUS: "/orders/:id/status",
    GET_ORDER_DETAILS: "/orders/:id",
  },
  SHOP: {
    GET_MY_SHOP: "/shops/my-shop",
    UPDATE_SHOP_INFO: "/shops/my-shop",
    TOGGLE_SHOP_STATUS: "/shops/my-shop/status",
  },
};

export default ENDPOINTS;
