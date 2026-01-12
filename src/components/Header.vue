<template>
  <div class="header">
    <div class="nav-bar">
      <router-link class="brand" to="/">
        <img src="/Icon.png" alt="The Vayuputra" class="brand-mark" />
        <span class="brand-text">The Vayuputra</span>
      </router-link>
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="hamburger-icon" :class="{ active: isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <nav class="nav-links" :class="{ 'menu-open': isMenuOpen }">
        <!-- <router-link to="/" @click="closeMenu">About me</router-link> -->
        <router-link to="/game-projects" @click="closeMenu">Games</router-link>
        <!-- <router-link to="/other-projects" @click="closeMenu">Other Projects</router-link>       -->
        <router-link to="/contact" @click="closeMenu">Contact</router-link>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AppHeader",
  setup() {
    const isMenuOpen = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    return {
      isMenuOpen,
      toggleMenu,
      closeMenu
    };
  }
});

</script>

<style scoped lang="less">

@import '../css/variables.less';

.header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 9;
  backdrop-filter:saturate(100%) blur(10px);
}

.nav-bar {
  text-align: right;
  padding: 20px;
  line-height: 3em;
  box-shadow: 0 2px 0 rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 10;
}

.hamburger-icon {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
  height: 18px;
  position: relative;
  
  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  &.active {
    span:nth-child(1) {
      transform: rotate(45deg) translate(7px, 7px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0;
}

.nav-links a {
  text-transform: uppercase;
  margin-left: 15px;
  margin-right: 15px;
  padding-bottom: 8px;
  white-space: nowrap;
  display: inline-block;
  text-decoration: none;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-transform: none;
  letter-spacing: 0.4px;
  margin-left: 0;
  margin-right: auto;
  padding-bottom: 0;
  flex-shrink: 0;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: inline-block;
  object-fit: contain;
  flex-shrink: 0;
}

.brand-text {
  font-weight: 800;
  font-size: 1.2em;
  background: linear-gradient(90deg, #ffffff, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 18px rgba(99,102,241,0.12);
  transition: filter 0.2s ease;
}

/* Keep the brand always bright on all routes; disable hover/active changes */
.brand { opacity: 1 !important; }
.brand:hover { opacity: 1 !important; }
.brand { filter: brightness(1.15) !important; }
.brand .brand-text { filter: brightness(1.15) !important; }
.brand:hover .brand-text { filter: brightness(1.15) !important; }
.brand.router-link-active,
.brand.router-link-exact-active { filter: brightness(1.15) !important; }

.router-link-exact-active {
  border: 0;
  filter: brightness(1.15);
}

@media only screen and (max-width: 620px){
  .nav-bar {
    line-height: 2em;
    flex-wrap: wrap;
  }

  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(17, 24, 39, 0.98);
    backdrop-filter: saturate(100%) blur(10px);
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 9;
  }

  .nav-links.menu-open {
    display: flex;
  }

  .nav-links a {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding: 12px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    text-align: left;
  }

  .nav-links a:last-child {
    border-bottom: none;
  }
}

</style>