<template>
  <footer class="fb__footer" :class="menuOpen ? 'open' : ''">
      <div class="fb__footer__inner">
          <button class="fb__footer__menu" @click="menuOpen ? menuOpen = false : menuOpen = true">햄버거메뉴버튼</button>
      </div>
      <aside class="fb__menuLayer">
          <h2 class="fb__title--hidden">햄버거메뉴레이어</h2>
          <ul class="menu__wrapper">
              <li class="menu__each">
                  <a href="/">
                      날씨보기
                  </a>
              </li>
              <li class="menu__each">
                  <a href="/map">
                      지도로 보기
                  </a>
              </li>
              <li class="menu__each">
                  <a href="/pollution">
                    미세먼지 확인하기
                  </a>
              </li>
          </ul>
      </aside>
  </footer>
</template>
<script>
    export default {
        data() {
            return {
                menuOpen: false,
            }
        }
    }
</script>