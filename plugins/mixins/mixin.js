import $ from "jquery";

const mixin = {
    methods: {
        /**
         * api통신
         * @param {*} object 
         */
        requestApi (object) {
            if (!object.url) return ;
            
            return new Promise((resolve, reject) => {
                try {
                    $.ajax({
                        type: object.type ? object.type : "POST",
                        url: object.url,
                        data: object.data ? object.data : "",
                        success (result) {
                            resolve(result);
                        },
            
                        error(error) {
                            reject(error)
                        }
                    });
                }
            
                catch(error) {
                    reject(error)
                }
            })
        },

        /**
         * 현재 위치 알아오기
         */
        geoLocation() {
            return new Promise((resolve, reject) => {
                try {
                    if (window.navigator.geolocation) { // GPS를 지원하면
                        // 현재 위치 정보를 가져온다.
                        window.navigator.geolocation.getCurrentPosition(
                            function(position) {
                                resolve(position);
        
                            },
                            function(error) {
                                alert("브라우저 설정에서 위치 허용을 해주셔야 정확한 날씨정보를 사용하실 수 있습니다.")
                                resolve(error)
                            }, 
                            {
                                enableHighAccuracy: false,
                                maximumAge: 0,
                                timeout: Infinity
                            }
                        );
                    } 
                    else {
                        alert("GPS를 지원하지 않습니다");
                    }
                }
                catch(error) {
                    reject(error)
                }
            });
 
            
        }
    }
}

export default mixin;