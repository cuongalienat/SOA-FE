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
  },
  ORDER: {
    CREATE_ORDER: "/orders",
    GET_USER_ORDERS: "/orders/myOrders",
    CANCEL_ORDER: "/orders/:id/cancel",
    GET_SHOP_ORDERS: "/orders/manage",
    UPDATE_STATUS: "/orders/:id/status",
    GET_ORDER_DETAILS: "/orders/:id",
  }
};

export default ENDPOINTS;
