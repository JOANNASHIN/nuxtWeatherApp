import http from "http";

export default function ({route}) {
    // context.userAgent = process.server
    //     ? context.req.header["user-agent"]
    //     : navigator.userAgent


    return http.post("http://my-stats-api.com", {
        url: route.fullPath
    })
}