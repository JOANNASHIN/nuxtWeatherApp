
<template>
    <section class="fb__weather">
        <h2 class="fb__title--hidden">날씨 확인</h2>

        <!-- 로딩 -->
        <div class="fb__loading" v-if="false === fetches.loading">
            <span class="fb__weather__loc"></span>
            <p class="fb__weather__desc"></p>
            <span class="fb__weather__icon"></span>
            <span class="fb__weather__temp"></span>
        </div>

        <!-- 로딩아닌케이스 -->
        <section class="fb__weather__cont fb__loading__after" v-else-if="true === fetches.loading">
            <h3 class="fb__title--hidden">날씨 영역</h3>
            <!-- 상단 -->
            <header>
                <button class="fb__weather__gps" @click="requestCurrentPosition()">현재위치</button>

                <nav class="fb__weather__search" :class="isVisibleSearch ? 'show' : ''" @click="isVisibleSearch = true">
                    <!--  :autofocus="isVisibleSearch ? true : false" -->
                    <input type="text" placeholder="위치를 입력해주세요" v-model.trim="searchLocation"  @keyup.enter="searchWeather()">
                    <button @click="searchWeather()">도시찾기</button>
                </nav>
            </header>

            <!-- 오늘 -->
            <template v-if="true === fetches.summary">
                <div class="fb__weather__summary">

                    <!-- 현재위치 -->
                    <span class="fb__weather__loc">{{user.location}}</span>
                    
                    <!-- 설명 -->
                    <p class="fb__weather__desc" v-if="current.weather && current.weather.length">
                        <template v-for="(data, idx) in current.weather">
                            {{data.description}}
                            <template v-if="idx != (current.weather.length - 1)">
                                /
                            </template>
                        </template>
                    </p>

                    <!-- 현재 -->
                    <figure class="fb__weather__icon" v-if="current.weather && current.weather.length">
                        <template v-for="(data, idx) in current.weather">
                            <img id="js__weather__icon" :src="`https://openweathermap.org/img/wn/${data.icon}@2x.png`" alt="" :key="'data' + idx">
                        </template>
                    </figure>

                    <div>
                        <span class="fb__weather__temp"><em>{{current.temp}}</em>˚</span>
                        <!-- <span style="line-height: 1.3;">체감온도 {{current.feels_like}}˚</span> -->
                    </div>

                    <!-- 오늘의 최고/최저 -->
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

                    <!-- 어제날씨 -->
                    <ul class="fb__weather__past" v-if="true === fetches.yesterday">
                        <li class="past__yesterday">
                            <span>어제의 이 시간에는 </span>
                            <em>{{mathFloorTemp(yesterday.temp)}}˚ 였고</em>
                            <img class="past__icon" :src="`https://openweathermap.org/img/wn/${yesterday.weather[0].icon}@2x.png`" alt="">
                            <span> 체감온도는 {{mathFloorTemp(yesterday.feels_like)}}˚ 였어요</span>
                        </li>
                    </ul>
                </div>
            </template>

            <!-- 하단 -->
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
    </section>
</template>

<script>
    import $ from "jquery";
    import moment from "moment";
    import convert from "xml-js";
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
                    yesterday: false,
                },

                requests: {
                    weather: {
                        lat: null,
                        lon: null,
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

                currentGPS: {},

                weatherBackground: {
                    "default": "ccc",
                    "Clear": "#45c3e3",
                    "Rain": "#5b6986",
                    "Mist": "#5b6986",
                    "Drizzle": "#5b6986",
                    "Clouds": "#355cac",
                    "Snow": "#a8c2c6"
                },

                user: {},

                current: {},
                today: [],
                yesterday: [],
                hourly: [],
                daily: [],

                isVisibleSearch: false,
                searchLocation: null,
            }
        },

        created() {
            console.clear();
        },

        mounted(){
           this.requestCurrentPosition();
        },

        methods: {
            async requestCurrentPosition () {
                const response = await this.geoLocation();
                const coords = response.coords;
                if (coords) {
                    this.position = {
                        lat: coords.latitude,
                        lon: coords.longitude,
                    }
                }
                else {
                    this.position = {
                        lat: 36.532987599245075,
                        lon: 127.2553285580849,
                    }

                    console.error(response);
                }

                this.afterRequestPosition();
            },

            //검색하기
            searchWeather() {
                const newLocation = this.searchLocation;
                const _this = this;

                if (!newLocation) return ;
                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new kakao.maps.services.Geocoder();

                // 주소로 좌표를 검색합니다
                geocoder.addressSearch(newLocation, function(result, status) {

                    // 정상적으로 검색이 완료됐으면 
                    if (status === kakao.maps.services.Status.OK) {

                        // var coords = new kakao.maps.LatLng(, result[0].x);

                        _this.position = {
                            lat: result[0].y,
                            lon: result[0].x
                        }
                        _this.afterRequestPosition();
                    } 
                    else {
                        alert("주소가 정확하지 않습니다. 다시 입력하여주세요. \nex) 성포동 / 제주도 / 서울시");
                    }
                });    
            },

            //공통 이벤트
            afterRequestPosition() {
                this.fetches.loading = true;
                this.mapapi();
                this.requestWeather();
                this.requestPastWeather();
            },

            //주소반환
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

                        _this.$set(_this.user, "location", location)
                    }     
                }

                searchAddrFromCoords(mapOption.center, displayCenterInfo);
            },

            //날씨요청
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
                        this.current = response.current;
                        this.current.temp = this.mathFloorTemp(this.current.temp);

                        this.hourly = response.hourly;
                        this.hourly = this.hourly.splice(0, 24);

                        this.daily = response.daily;
                        this.today = this.daily.shift();

                        const _backgrond = this.current.weather[0].main; 

                        $(".fb").css({ 
                            "background": this.weatherBackground[_backgrond]
                        })
                    }            

                    this.fetches.summary = true;
                }

                catch {
                    console.error("requestWeather has exception...")
                }
            },

            //과거 날씨 요청
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
                        this.fetches.yesterday = true;
                    }
                }

                catch {
                    console.error("requestPastWeather has exception...")
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