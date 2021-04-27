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
                requests: {
                    weather: {
                        lat: null,
                        lon: null,
                        appid: "af134da678fac6615bd7aabed303b791",
                        units: "metric",
                        lang: "kr",
                    },
                },

                position: {
                    lat: 36.232987599245075,
                    lon: 127.8553285580849,
                },

                locationList: [
                    {
                        locationName: "서울",
                        lat: "37.6640455",
                        lon: "126.834005"
                    },
                    {
                        locationName: "춘천",
                        lat: "37.8688326", 
                        lon: "127.7148405"
                    },
                    {
                        locationName: "수원",
                        lat: "37.2788631", 
                        lon: "126.9908307"
                    },
                    {
                        locationName: "청주",
                        lat: "36.6392137", 
                        lon: "127.4346807"
                    },
                    {
                        locationName: "강릉",
                        lat: "37.6635969", 
                        lon: "128.6830913"
                    },
                    {
                        locationName: "대전",
                        lat: "36.3503919", 
                        lon: "127.3833596"
                    },
                    {
                        locationName: "대구",
                        lat: "35.8798688", 
                        lon: "128.4966607"
                    },
                    {
                        locationName: "안동",
                        lat: "36.5627638", 
                        lon: "128.6917807"
                    },
                    {
                        locationName: "전주",
                        lat: "35.8255645", 
                        lon: "127.0965807"
                    },
                    {
                        locationName: "광주",
                        lat: "35.1768202", 
                        lon: "126.7737607"
                    },
                    {
                        locationName: "목포",
                        lat: "34.8028655", 
                        lon: "126.3851807"
                    },
                    {
                        locationName: "여수",
                        lat: "34.7525655", 
                        lon: "127.6568307"
                    },
                    {
                        locationName: "부산",
                        lat: "35.1645702", 
                        lon: "129.0017607"
                    },
                    {
                        locationName: "울산",
                        lat: "35.5621694", 
                        lon: "129.2814607"
                    },
                    {
                        locationName: "제주",
                        lat: "33.2502176", 
                        lon: "126.5587452"
                    },
                    {
                        locationName: "울릉도",
                        lat: "37.5063838", 
                        lon: "130.8483988"
                    },
                    {
                        locationName: "독도",
                        lat: "37.242953", 
                        lon: "131.8580873"
                    },
                ]

            }
        },

        created() {
            if (process.client) {
            }
        },

        mounted() {
            this.getWeather();
        },

        methods: {
            getWeather() {
                this.locationList.forEach(async (location, idx) => {
                    let weather = await this.requestWeather(location);
                    
                    Object.assign(this.locationList[idx], weather);


                    if (idx === this.locationList.length - 1) {
                        this.drawMap();
                    }
                });


            },

            async drawMap() {
                const position = this.position;
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(position.lat, position.lon),
                    level: 13
                };

                const map = new kakao.maps.Map(container, options);

                map.setZoomable(false);

                this.locationList.forEach(location => {

                    // 마커가 표시될 위치입니다 
                    const markerPosition  = new kakao.maps.LatLng(location.lat, location.lon); 

                    // 마커를 생성합니다
                    const marker = new kakao.maps.Marker({
                        position: markerPosition
                    });

                    // 마커가 지도 위에 표시되도록 설정합니다
                    // marker.setMap(map);


                    let iwContent = `<div class="fb__infoWindow">
                                        <figure class="fb__infoWindow__icon">
                                            <img src="https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png">
                                        </figure>
                                        <div class="fb__infoWindow__text">
                                            <span class="fb__infoWindow__location">${location.locationName}</span>    
                                            <span class="fb__infoWindow__temp">${location.temp}˚</span>    
                                        </div>
                                    </div>`;

                    let iwPosition = new kakao.maps.LatLng(location.lat, location.lon); //인포윈도우 표시 위치입니다


                    // 커스텀 오버레이를 생성합니다
                    var customOverlay = new kakao.maps.CustomOverlay({
                        position: iwPosition,
                        content: iwContent,
                        xAnchor: 0.3,
                        yAnchor: 0.91
                    });

                    // 커스텀 오버레이를 지도에 표시합니다
                    customOverlay.setMap(map);
                })


                
            },

            //날씨요청
            async requestWeather(position) { 
                try { 
                    const parameter = Object.assign(this.requests.weather, {
                        lat: position.lat,
                        lon: position.lon
                    });

                    const response = await this.requestApi({
                        type: "get",
                        url: "https://api.openweathermap.org/data/2.5/onecall",
                        data: parameter
                    })

                    if (response) {
                        if (response) {
                            response.current.temp = this.mathFloorTemp(response.current.temp);
    
                            return response.current;
                        }

                    }            
                }

                catch(ex) {
                    console.error("requestWeather has exception...")
                    return false;
                }
            },

            mathFloorTemp(temp) {
                return Math.floor(temp);
            },
        }
    }
</script>