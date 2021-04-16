<template>
    <section class="fb__map">
        <h2 class="fb__title--hidden">지도</h2>
        <div id="map" class="fb__map__box"></div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                position: {}
            }
        },
        created() {
            if (process.client) {
                
            }
        },
        mounted() {
            this.requestCurrentPosition();
        },
        methods: {
            //현재위치 알아오기
            requestCurrentPosition() {
                const _this = this;
                if (window.navigator.geolocation) { // GPS를 지원하면

                    // 현재 위치 정보를 가져온다.
                    // navigator.geolocation.getCurrentPosition(성공콜백, 에러콜백, 옵션);
                    window.navigator.geolocation.getCurrentPosition(
                        function(position) {
                            const coords = position.coords;
                    
                            _this.position = {
                                lat: coords.latitude,
                                lon: coords.longitude,
                            }

                            _this.currentGPS = _this.position;
                            _this.drawMap();

                        },
                        function(error) {
                            alert("위치 허용을 해주셔야 정확한 날씨정보를 사용하실 수 있습니다.")

                            _this.position = {
                                lat: 36.532987599245075,
                                lon: 127.2553285580849,
                            }

                            _this.currentGPS = _this.position;
                            _this.drawMap();
                        }, 
                        {
                            enableHighAccuracy: false,
                            maximumAge: 0,
                            timeout: Infinity
                        }
                    );

                } else {
                    alert("GPS를 지원하지 않습니다<br>");
                }
            },

            drawMap() {
                const position = this.position;
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(position.lat, position.lon),
                    level: 3
                };

                const map = new kakao.maps.Map(container, options);
                map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
            }
        }
    }
</script>