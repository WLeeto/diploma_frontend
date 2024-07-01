export const baseURL = 'http://127.0.0.1:8000/'

export const endpoints = {
    GETTOKEN: `${baseURL}api/token/`,
    REFRESHTOKEN: `${baseURL}api/token/refresh/`,

    REGISTERUSER: `${baseURL}api/register/`,

    GETUSERFILES: `${baseURL}files/user/`,
    GETUSERFILE: `${baseURL}files/`,
    DELETEUSERFILE: `${baseURL}files/`,
    UPLOADFILE: `${baseURL}files/`,

    GETADMINDATA: `${baseURL}files/admin/`,
    DELETEUSER: `${baseURL}api/deleteuser/`,

    SETCOMMENT: `${baseURL}files/comments/`,
    GETSHARELINK: `${baseURL}files/share_link/`,
    SETFILENAME: `${baseURL}files/`,
}