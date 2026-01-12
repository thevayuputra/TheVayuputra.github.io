<template>
  <div id="app">
    <Header />
    <div class="main">
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Helpers from './helpers';

export default defineComponent({
  name: 'App',
  components: {
    Header, Footer
  }
});

// Preload heavy images or gifs that are used in other pages
fetch(`${import.meta.env.BASE_URL}projectList.json`)
  .then(response => response.json())
  .then(async projectList => {
    const globalBaseUrl = projectList.baseUrl;
    const preloadImages: string[] = [];
    const preloadVideos: string[] = [];

    const gameProjects = Array.isArray(projectList.gameProjects) ? projectList.gameProjects : [];
    const otherProjects = Array.isArray(projectList.otherProjects) ? projectList.otherProjects : [];

    // Helper function to process override preload items
    const processOverridePreload = (preloadItems: string[], baseUrl: string, projectId: string) => {
      preloadItems.forEach((item: string) => {
        let fullUrl: string;
        if (item.startsWith('http')) {
          // Absolute URL
          fullUrl = item;
        } else if (item.startsWith('/')) {
          // Absolute path - public folder asset, use it directly from domain root
          // Public folder assets are served from the domain root, not relative to BASE_URL
          fullUrl = `${window.location.origin}${item}`;
        } else {
          // Relative to project folder
          fullUrl = `${baseUrl}${projectId}/${item}`;
        }
        if (item.match(/\.(mp4|webm|ogg|mov)$/i)) {
          preloadVideos.push(fullUrl);
        } else {
          preloadImages.push(fullUrl);
        }
      });
    };

    const projectPromises = [
      ...gameProjects.map(async (project: { id: string; baseUrl?: string; override?: { preload?: string[] } }) => {
        const baseUrl = project.baseUrl || globalBaseUrl;
        
        // Check for override.preload first
        if (project.override?.preload && Array.isArray(project.override.preload)) {
          processOverridePreload(project.override.preload, baseUrl, project.id);
        }
        
        // Also check data.json for preloadImages
        try {
          const response = await fetch(`${baseUrl}${project.id}/data.json`);
          const data = await response.json();
          if (data.preloadImages && Array.isArray(data.preloadImages)) {
            preloadImages.push(...data.preloadImages.map((img: string) => `${baseUrl}${project.id}/${img}`));
          }
        } catch (error) {
          // Silently fail if data.json doesn't exist
        }
      }),
      ...otherProjects.map(async (project: { id: string; baseUrl?: string; override?: { preload?: string[] } }) => {
        const baseUrl = project.baseUrl || globalBaseUrl;
        
        // Check for override.preload first
        if (project.override?.preload && Array.isArray(project.override.preload)) {
          processOverridePreload(project.override.preload, baseUrl, project.id);
        }
        
        // Also check data.json for preloadImages
        try {
          const response = await fetch(`${baseUrl}${project.id}/data.json`);
          const data = await response.json();
          if (data.preloadImages && Array.isArray(data.preloadImages)) {
            preloadImages.push(...data.preloadImages.map((img: string) => `${baseUrl}${project.id}/${img}`));
          }
        } catch (error) {
          // Silently fail if data.json doesn't exist
        }
      })
    ];

    await Promise.all(projectPromises);
    Helpers.preloadImages(preloadImages);
    Helpers.preloadVideos(preloadVideos);
  })
  .catch(error => {
    console.error('Error loading project list or preloading images:', error);
  });
</script>

<style lang="less">

@import './css/projects.less';
@import './css/variables.less';

html, body {
  margin: 0px;
  background-color: @bodyBgColor;
}

#app {
  background-color: @contentBgColor;
  color: @textColor;

  font-family: 'Karla', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  font-size: 1.1em;
  line-height: 1.6em;
  text-align: justify;
}

h1, h2, h3, h4, h5 {
  text-align: left;
}

a {
  color: @textColor;
  text-decoration: none;
  opacity: 0.5;
}
a:hover, .router-link-exact-active {
  opacity: 1;
}

h1 {
  font-size: 2.5em;
  font-weight: 100;
  margin-top: -10px;
  margin-bottom: 40px;
  margin-left: -2px; // hack to make it "seem" more aligned with smaller text content
  line-height: 1.1em;
}

.main {
    padding: 12px;
  }

@media only screen and (min-width: 620px){

  #app {
    text-align: left;
    line-height: 1.8em;
  }

  h1 {
    margin-top: 0.67em;
    margin-bottom: 80px;
    line-height: 0.7em;
  }

  .main {
    padding: 0px 40px 40px 40px;
  }

  .main, .header, .footer {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

</style>
