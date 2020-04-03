export const AppConstants = {
    PRODUCT_NAME: 'MYPAGE',
    DEFAULT_PAGE_ID: 1,
    API_ENDPOINTS: {
        AUTH: {
            SIGN_IN: 'v1/authenticate',
            SIGN_UP: 'v1/signup',
            VERIFY_EMAIL: 'v1/verifyEmail',
            FORGOT_PASSWORD: 'v1/forgotPassword',
            RESET_PASSWORD: 'v1/resetPassword',
            UPDATE_PROFILE: 'v1/updateProfile',
            CHANGE_PASSWORD: 'v1/changePassword'
        },
        GET_ALL_CARDS: '/v1/card/get-all-cards',
        CARD: '/v1/card/',
        GET_ALL_PAGES: '/v1/page/get-all-pages',
        PAGE: '/v1/page',
        CLONE_PAGE: '/v1/page/page-clone',
        LINK_CARD: '/v1/page/link-card',
        UNLINK_CARD: '/v1/page/unlink-card',
        RATE_CARD: '/v1/card/card-rate',
        SHARE_PAGE: '/v1/page/page-share',
        UPLOAD_IMG_FILE: '/v1/file/upload/',
        GET_ALL_MENU_CAT: '/v1/menuCategories/list',
        MENU_CATEGORY: '/v1/menuCategories',
        MENU_ITEM: '/v1/menuItem',
        GET_ALL_MENU_ITEM: '/v1/menuItem/list',
        LINK_MENU_ITEM: '/v1/menuCategories/link-menuItem',
        UN_LINK_MENU_ITEM: '/v1/menuCategories/unlink-menuItem',
        ADD_MENU_ITEM: '/v1/menuCategories/add-item',
        REMOVE_MENU_ITEM: '/v1/menuCategories/remove-item',
        EDIT_MENU: '/v1/menuCategories/edit-menu',
        READ_MESSAGE: 'v1/message/status/'
    },
    REQUEST_URL: {
        PAGE: 'page/'
    },
    STATUS_CODE: {
        SUCCESS: 200,
        CREATED: 201,
        MAX_SUCCESS_CODE: 206
    },
    AUTH_DATA: {
        ID: 'id',
        USERNAME: 'username',
        TOKEN: 'token',
        ROLE_ID: 'role_id',
        APP_JSON_CONTENT_TYPE: 'application/json',
        CORS: '*',
        SESSION_ID: 'session',
        AUTH_DETAILS: 'authDetails',
        EXPITRED_AT: 'expires_at',
        AUTHORISATION_RULES: 'rules'
    },
    API_URLS_SHOWING_INLINE_MESSAGES: [],
    AUTH_KEYS: {
        TOKEN: 'token'
    },
    STATUS_CODES: {
        SUCCESS: 200
    },
    APP_URLS: {
        SIGN_IN: 'signin',
        PAGE: 'page',
        MENU: 'menu',
        MY_MENU: 'my-menu'
    },
    TOAST_MESSAGE_TYPES: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARN: 'warning'
    },
    NMM_MESSAGE_CODES: { // NMM = Near Message Management
        LOGIN_SUCCESS_CODE: 'PLT-001'
    },
    HTTP_MESSAGE_TYPE: {
        WARN: 'WARN',
        ERROR: 'ERROR',
        CONFIRM: 'CONFIRM',
        INFO: 'INFO'
    },
    ALERT_TYPE: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARN: 'warning',
        INFO: 'info',
        DANGER: 'danger',
        PRIMARY: 'primary'
    },
    PASSWORD_STRENGTH_COLORS: {
        STRONG_PASSWORD_COLOR: 'green',
        MEDIUM_PASSWORD_COLOR: 'orange',
        WEAK_PASSWORD_COLOR: 'red',
    },
    COUNTRY_LIST: {
        IND: 'India'
    },
    RENDER_TYPES: [
        { text: 'Select render type', value: '' },
        { text: 'Internal (Self rendered)', value: 'internal' },
        { text: 'Link (Open new window)', value: 'link' }
    ]
};
