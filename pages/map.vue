<template>
    <div class="container">
        <div id="map"></div>
    </div>
</template>
<script>
    // import mixin from "../plugins/mixins/global"
    export default {
        created() {
             if (process.client) {
                // console.log("created!")
                // const script = document.createElement('script');
                // /* global kakao */
                // script.onload = () => kakao.maps.load(this.initMap);
                // // script.src = 'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=YOUR_APPKEY';
                // script.src = 'http://dapi.kakao.com/v2/maps/sdk.js?appkey=9ec652bd0d4224b306e150a002233b10&libraries=services,clusterer,drawing';
                // document.head.appendChild(script);
                // console.log("created끝")
            }
        },
        mounted() {
            this.drawMap();
        },
        methods: {
            drawMap() {
                var container = document.getElementById('map');
                var options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
                };

                var map = new kakao.maps.Map(container, options);
                map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
            }
        }
    }
</script>
<style>
#map {
    width: 400px;
    height: 300px;
}</style>