
<template>
    <main class="fb__weather" :style="`background-color:${weather.weatherBackground};` ">
        <h2 class="fb__title--hidden">날씨 확인</h2>

        <!-- 로딩 -->
        <div class="fb__loading" v-if="false === fetches.loading">
            <span class="fb__weather__loc"></span>
            <p class="fb__weather__desc"></p>
            <span class="fb__weather__icon"></span>
            <span class="fb__weather__temp"></span>
        </div>


        <section class="fb__weather__cont fb__loading__after" v-else-if="true === fetches.loading">
            <h3 class="fb__title--hidden">날씨 영역</h3>

            <template v-if="true === fetches.summary">
                <div class="fb__weather__summary">
                    <span class="fb__weather__loc">{{weather.location}}</span>
                    <p class="fb__weather__desc">{{weather.description}}</p>
                    
                    <figure class="fb__weather__icon">
                        <img id="js__weather__icon" :src="weather.weatherIcon" alt="">
                    </figure>
                    <span class="fb__weather__temp"><em>{{weather.currentTemp}}</em>˚</span>

                    <ul class="fb__weather__past">
                        <li class="past__desc">
                            <span>최고:</span>
                            <em>{{mathFloorTemp(today.temp.max)}}</em><span class="fb__weather__unit">섭씨</span>
                        </li>
                        <li class="past__desc">
                            <span>최저:</span>
                            <em>{{mathFloorTemp(today.temp.min)}}</em><span class="fb__weather__unit">섭씨</span>
                        </li>
                    </ul>
                    <ul class="fb__weather__past">
                        <li class="past__desc" style="font-size: 3vw;">
                            <span>어제의 이 시간에는 </span>
                            <!-- <img :src="`https://openweathermap.org/img/wn/${yesterday.weather[0].icon}@2x.png`" alt=""> -->
                            <em>{{mathFloorTemp(yesterday.temp)}}˚</em>
                            <span>( 체감온도는 {{mathFloorTemp(yesterday.feels_like)}}˚ )</span>
                        </li>
                        <!-- <li class="past__desc">
                            <span>어제의 체감온도:</span>
                            <em>{{mathFloorTemp(yesterday.feels_like)}}</em><span class="fb__weather__unit">섭씨</span>
                        </li> -->
                    </ul>
                </div>
            </template>

            <div class="fb__weather__detail">
                <ul class="fb__weather__hourly" v-if="hourly && hourly.length">
                    <li class="hourly__each" v-for="(data, index) in hourly" :key="index">
                        <span class="hourly__time">{{getHour(data.dt)}}시</span>                        
                        <figure class="hourly__icon">
                            <template v-if="data.weather && data.weather.length">
                                <img :src="`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`" alt="">
                            </template>
                        </figure>
                        <span class="hourly__temp" v-if="data.temp"><em>{{mathFloorTemp(data.temp)}}</em>˚</span>
                    </li>
                </ul>

                <ul class="fb__weather__daily" v-if="hourly && hourly.length">
                    <li class="daily__list" v-for="(data, index) in daily" :key="index">
                        <span class="daily__time">{{getDate(data.dt)}}</span>                        
                        <figure class="daily__icon">
                            <template v-if="data.weather && data.weather.length">
                                <img :src="`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`" alt="">
                            </template>
                        </figure>
                        <div class="daily__temp">
                            <span class="daily__temp--max"><em>{{mathFloorTemp(data.temp.max)}}</em>˚</span>
                            <span class="daily__temp--min"><em>{{mathFloorTemp(data.temp.min)}}</em>˚</span>
                        </div>
                    </li>
                </ul>
            </div>
        </section>

        <section v-else-if="'error' === fetches.loading">
            오류가 발생하였습니다.
        </section>
    </main>
</template>

<script>
    import $ from "jquery";
    import moment from "moment";
    //  window.moment = moment;
    moment.lang('ko', {
        weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
        weekdaysShort: ["일","월","화","수","목","금","토"],
    });

    export default {
        head() {
            return {
                title: "날씨어플리케이션"
            }
        },
        data() {
            return {
                fetches: {
                    loading: true,
                    summary: false,
                },

                requests: {
                    weather: {
                        lat: null,
                        lon: null,
                        // exclude: "hourly",
                        appid: "af134da678fac6615bd7aabed303b791",
                        units: "metric",
                        lang: "kr",
                    },

                    past: {
                        lat: null,
                        lon: null,
                        dt: null,
                        appid: "af134da678fac6615bd7aabed303b791",
                        units: "metric",
                        lang: "kr",
                    }
                },
                
                position: {},

                weatherBackground: {
                    "Clear": "skyblue",
                    "Rain": "#5b6986",
                    "Mist": "#5b6986",
                    "Drizzle": "#5b6986",
                    "Clouds": "#355cac",
                    "snow": "#c8dee1"
                },

                weather: {},
                //어제
                yesterday: [],
                //오늘
                today: [],
                hourly: [],
                daily: [],
            }
        },

        created() {
            console.clear();
        },

        mounted(){
            this.requestCurrentPosition();
        },

        methods: {
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
    
                            _this.fetches.loading = true;    

                            _this.mapapi();
                            _this.requestWeather();
                            _this.requestPastWeather();

                        },
                        function(error) {
                            alert("위치 허용을 해주셔야 정확한 날씨정보를 사용하실 수 있습니다.")

                            _this.position = {
                                lat: 36.532987599245075,
                                lon: 127.2553285580849,
                            }

                            _this.mapapi();
                            _this.requestWeather();
                            _this.requestPastWeather();
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

            mapapi() {
                const _this = this;
                const mapOption = {
                    center: new kakao.maps.LatLng(this.position.lat, this.position.lon), //지도의 중심좌표.
                    level: 13 //지도의 레벨(확대, 축소 정도)
                };  

                // 주소-좌표 변환 객체를 생성합니다
                const geocoder = new kakao.maps.services.Geocoder();

                function searchAddrFromCoords(coords, callback) {
                    // 좌표로 행정동 주소 정보를 요청합니다
                    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
                }
    
                // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
                function displayCenterInfo(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        let location = result[1].address_name;

                        _this.$set(_this.weather, "location", location)
                    }     
                }

                searchAddrFromCoords(mapOption.center, displayCenterInfo);
            },

            async requestWeather() { 
                try { 
                    const parameter = Object.assign(this.requests.weather, {
                        lat: this.position.lat,
                        lon: this.position.lon
                    });

                    const response = await this.requestApi({
                        type: "get",
                        url: "https://api.openweathermap.org/data/2.5/onecall",
                        data: parameter
                    })

                    if (response) {
                        this.drawResult(response);
                        this.hourly = response.hourly;
                        this.hourly = this.hourly.splice(0, 12);

                        this.daily = response.daily;
                        this.today = this.daily.shift();
                        console.log(this.today,"오늘!!");
                    }            

                    this.fetches.summary = true;
                }

                catch {
                    console.error("requestWeather has exception...")
                }
            },

            async requestPastWeather() { 
                try {
                    const parameter = Object.assign(this.requests.past, {
                        lat: this.position.lat,
                        lon: this.position.lon,
                        dt: moment().subtract(1, 'days').format("X"),
                    });

                    const response = await this.requestApi({
                        type: "get",
                        url: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
                        data: parameter
                    })

                    if (response) {
                        this.yesterday = response.current;
                        console.log("어제:", this.yesterday)
                        // this.$set(this.yesterday, "temp", Math.floor(response.current.temp))
                        // this.$set(this.yesterday, "feelsLike", Math.floor(response.current.feels_like))
                    }
                }

                catch {
                    console.error("requestPastWeather has exception...")
                }
            },

            drawResult(response) {
                const _current = response.current;
                
                if (_current) {
                    const _backgrond = _current.weather[0].main; 

                    this.$set(this.weather, "weatherBackground", this.weatherBackground[_backgrond])
                    this.$set(this.weather, "description", _current.weather[0].description)
                    this.$set(this.weather, "currentTemp", Math.floor(_current.temp))
                    this.$set(this.weather, "weatherIcon", `https://openweathermap.org/img/wn/${_current.weather[0].icon}@2x.png`)
                }
            },

            getDate(dt) {
                // return moment(Number(dt) * 1000).format("YY-MM-DD");
                return moment(Number(dt) * 1000).format("MM/DD ddd");
            },

            getHour(time) {
                return moment(Number(time) * 1000).format("HH")
            },

            mathFloorTemp(temp) {
                return Math.floor(temp);
            }
        }

    }
</script>

<style lang="scss" scope>
</style>