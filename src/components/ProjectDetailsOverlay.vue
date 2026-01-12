<template>
  <transition name="fade">
    <div v-if="visible">
      <div class="overlay" @click="$emit('close')">
      </div>
      <div class="dialog" :style="{ 'background-color': color }">
        <h1 class="dialog-title">{{ title }}</h1>
        <div @click="$emit('close')" class="dialog-close"><i class="fa fa-times fa-lg fa-fw"></i></div>
        <div class="dialog-content">

          <!-- My Role -->
          <div v-if="projectData?.role && projectData.role.trim() !== ''" class="my-role">
            <h3>My Role</h3>
            <div v-html="projectData.role"></div>
          </div>

          
          <!-- Media Slider (Swiper) -->
          <div v-if="hasMedia" class="media-slider">
            <h3>Media</h3>
                <Swiper
                  class="custom-swiper"
                  :modules="modules"
                  :space-between="16"
                  :loop="true"
                  :auto-height="true"
                  :pagination="pagination"
                  :navigation="true"
                  @swiper="onSwiper"
                  @slide-change="onSlideChange"
                >
                  <SwiperSlide v-for="(video, index) in projectData?.videos || []" :key="`vid-${index}`">
                    <iframe :src="getVideoEmbedUrl(video)" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </SwiperSlide>
                  <SwiperSlide v-for="(image, index) in projectData?.images || []" :key="`img-${index}`">
                    <img :src="getFullUrl(image)" :alt="`Screenshot ${index + 1}`" />
                  </SwiperSlide>
                </Swiper>
            <div class="media-pagination"></div>
          </div>

          <!-- Short Description -->
          <div v-if="projectData?.shortDescription" class="short-description">
            <h3>Overview</h3>
            <div v-html="projectData.shortDescription"></div>
          </div>

          <!-- Full Description -->
          <div v-if="projectData?.fullDescription" class="full-description">
            <h3>Description</h3>
            <div v-html="projectData.fullDescription"></div>
          </div>          

          <!-- Links -->
          <div v-if="projectData?.links && projectData.links.length > 0" class="links-section">
            <h3>Links</h3>
            <div class="links-grid">
              <a 
                v-for="link in projectData.links" 
                :key="link.name"
                :href="link.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="link-button"
              >
                <i class="fa fa-external-link"></i>
                {{ link.name }}
              </a>
            </div>
          </div>

        </div>
        <div class="dialog-bottom">
          <a @click="$emit('close')" class="dialog-close-button">Close</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProjectData from "@/data/ProjectData";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default defineComponent({
  name: "ProjectDetailsOverlay",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    visible: Boolean,
    color: String,
    title: String,
    baseUrl: String,
    projectData: Object as () => ProjectData | null,
  },
  data() {
    return {
      modules: [Pagination, Navigation],
      pagination: {
        el: '.dialog .media-pagination',
        clickable: true,
        renderBullet: function (index: number, className: string) {
          return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
      },
      currentSlideIndex: 0,
      swiperRef: null as unknown as { slidePrev: () => void; slideNext: () => void },
      keydownHandler: null as unknown as (e: KeyboardEvent) => void,
    };
  },

  created() {
    this.keydownHandler = (event: KeyboardEvent) => this.onGlobalKeydown(event);
  },
  computed: {
    hasMedia(): boolean {
      return !!(this.projectData?.images?.length || this.projectData?.videos?.length);
    },
  },
  methods: {
    onGlobalKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.$emit('close');
      }
    },
    getFullUrl(path: string): string {
      if (path.startsWith("http")) {
        return path;
      }
      return `${this.baseUrl}${path}`;
    },
    getVideoEmbedUrl(videoUrl: string): string {
      if (videoUrl.includes("youtube.com/watch")) {
        const videoId = videoUrl.split("v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&mute=1&origin=${window.location.origin}`;
      }
      if (videoUrl.includes("youtu.be/")) {
        const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&mute=1&origin=${window.location.origin}`;
      }
      return videoUrl;
    },
    onSlideChange(swiper: { activeIndex: number }) {
      this.currentSlideIndex = swiper.activeIndex;
      setTimeout(() => {
        this.handleVideoPlayPause();
      }, 150);
    },
    onSwiper(swiper: { slidePrev: () => void; slideNext: () => void }) {
      this.swiperRef = swiper;
    },
    goPrev() {
      this.swiperRef?.slidePrev?.();
    },
    goNext() {
      this.swiperRef?.slideNext?.();
    },
    handleVideoPauseOnChange() {
      this.pauseAllVideos();
    },
    handleVideoPlayPause() {
      // Pause all first, then play current if it's a video slide
      this.pauseAllVideos();
      const videoCount = this.projectData?.videos?.length || 0;
      if (this.currentSlideIndex < videoCount) {
        this.playCurrentVideo();
      }
    },
    pauseAllVideos() {
      // For YouTube embeds, we can't directly control playback due to iframe restrictions
      // But we can send pause messages to all iframes
      const iframes = document.querySelectorAll<HTMLIFrameElement>('.media-slider iframe');
      iframes.forEach((iframe) => {
        try {
          iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (e) {
          void 0;
        }
      });
    },
    playCurrentVideo() {
      // For YouTube embeds, ensure muted then play (autoplay policies)
      const iframes = document.querySelectorAll<HTMLIFrameElement>('.media-slider iframe');
      const target = iframes[this.currentSlideIndex];
      if (target) {
        try {
          target.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
          setTimeout(() => {
            target.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          }, 50);
        } catch (e) {
          void 0;
        }
      }
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // Reset to first slide when opening
        this.currentSlideIndex = 0;
        // Handle initial video state after a short delay to ensure DOM is ready
        setTimeout(() => {
          this.handleVideoPlayPause();
        }, 100);
        // Add global listeners for ESC key
        window.addEventListener('keydown', this.keydownHandler as EventListener);
      } else {
        // Pause all videos when closing
        this.pauseAllVideos();
        // Remove listeners
        window.removeEventListener('keydown', this.keydownHandler as EventListener);
      }
    },
  },

  beforeUnmount() {
    // Cleanup in case component is removed while overlay open
    window.removeEventListener('keydown', this.keydownHandler as EventListener);
  },
});
</script>

<style scoped>
.overlay {
  background-color: rgba(0,0,0,0.5);
  z-index: 10;
  position:fixed;
  top:0px;
  left:0px;
  right:0px;
  bottom: 0px;
}

.dialog {
  position:absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 11;
  margin: 20px;
  padding-bottom: 10px;
  color:white;
  overflow: hidden; /* keep all content inside the popup */
}

iframe {
  width: 100%;
}

h1.dialog-title {
  text-align: center;
  font-size: 1.3em;
  margin: 0px;
  padding: 22px;
}

.dialog-content {
  padding: 20px;
}

.dialog-content {
  background-color: #fcfcfc;
  color: #696969;
}
.dialog-close {
  position: fixed;
  top: 20px;
  right: 20px;
  cursor:pointer;
  font-size: 1.2em;
  font-weight: 100;
  z-index: 12;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.dialog-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.dialog-bottom {
  text-align: center;
}

a.dialog-close-button {
  cursor:pointer;
  font-size: 1.4em;
  display: inline-block;
  margin: 0 auto;
}

/* Content sections */
.short-description,
.full-description,
.my-role,
.links-section {
  margin-bottom: 30px;
}

.short-description h3,
.full-description h3,
.my-role h3,
.links-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2em;
  border-bottom: 2px solid #eee;
  padding-bottom: 5px;
}

.short-description p,
.full-description p,
.my-role p {
  line-height: 1.6;
  margin: 0;
}

/* Media Slider */
.media-slider {
  margin-bottom: 30px;
  position: relative;
}

.media-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.media-swiper {
  flex: 1 1 auto;
  max-width: 82%; /* reduce swiper width so side buttons are outside */
}

.media-swiper :deep(.swiper),
.media-swiper :deep(.swiper-slide) {
  height: auto !important; /* ✅ let content define height */
  max-height: 80vh;
}

/* pagination positioned as a centered block below the swiper */
.media-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  z-index: 20;
  pointer-events: auto; /* keep bullets clickable */
  flex-wrap: wrap; /* Allow wrapping to multiple lines */
  max-width: 100%; /* Ensure it doesn't overflow */
}

.media-pagination :deep(.swiper-pagination-bullet) {
  margin: 0 6px;
  flex-shrink: 0; /* Prevent bullets from shrinking too much */
  min-width: 16px; /* Ensure minimum clickable size */
}

.side-nav {
  border: none;
  /* responsive square buttons: keep 1:1 ratio and scale with viewport */
  width: clamp(36px, 6vw, 56px);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.side-nav:hover {
  transform: scale(1.06);
}

.media-slider img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  display: block;
  border-radius: 8px;
  margin: 0 auto;
}

.media-slider iframe {
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  max-height: 100%;
  border: none;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

/* Center slide contents */
.media-slider :deep(.swiper-slide) {
  display: flex;
  align-items: center;
  justify-content: center;
}


/* Force all images and iframes inside the Swiper to respect 80vh limit */
.media-slider :deep(.swiper-slide img),
.media-slider :deep(.swiper-slide iframe) {
  max-width: 100%;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}




/* Custom Swiper Pagination */
.media-slider :deep(.swiper-pagination) {
  position: relative;
  margin-top: 20px;
}

.media-slider :deep(.swiper-pagination-bullet) {
  width: 16px;
  height: 16px;
  background: #ccc;
  opacity: 1;
  margin: 0 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 10px;
  line-height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Prevent bullets from shrinking too much */
  min-width: 16px; /* Ensure minimum clickable size */
}

.media-slider :deep(.swiper-pagination-bullet:hover) {
  background: #999;
  transform: scale(1.15);
}

.media-slider :deep(.swiper-pagination-bullet-active) {
  background: #333;
  transform: scale(1.25);
}

/* Custom Swiper Navigation */
.media-slider :deep(.swiper-button-next),
.media-slider :deep(.swiper-button-prev) {
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 5;
  pointer-events: auto;
}

.media-slider :deep(.swiper-button-next:hover),
.media-slider :deep(.swiper-button-prev:hover) {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.media-slider :deep(.swiper-button-next:after),
.media-slider :deep(.swiper-button-prev:after) {
  font-size: 18px;
  font-weight: bold;
}

.media-slider :deep(.swiper-button-disabled) {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Ensure navigation is clickable over iframes */
.media-slider :deep(.swiper) {
  position: relative;
  overflow: hidden; /* confine slides within popup */
}

/* Keep nav buttons vertically centered */
.media-slider :deep(.swiper-button-prev),
.media-slider :deep(.swiper-button-next) {
  top: 50%;
  transform: translateY(-50%);
}

/* Put iframes below nav buttons */
.media-slider :deep(iframe) {
  position: relative;
  z-index: 1;
}

/* Links */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f5f5f5;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 1px solid #ddd;
}

.link-button:hover {
  background: #e9e9e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.link-button i {
  font-size: 0.9em;
}

@media only screen and (min-width: 620px){
  .dialog {
    margin: 0 auto;
    margin-top: 80px;
    margin-bottom: 40px;
    max-width: 1000px;
  }

  h1.dialog-title {
    font-size: 1.6em;
  }

  .dialog-content {
    padding: 40px;
  }

  .media-slider iframe {
    height: 400px;
  }

  .links-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

/* 🧭 Limit Swiper height */
.custom-swiper {
  width: 100%;
  max-height: 80vh;
  height: auto;           /* ✅ allow auto height based on image ratio */
  overflow: visible;      /* ✅ don’t clip portrait images */
}


/* Make slide contents fit within 80% height */
.custom-swiper :deep(.swiper-slide) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-swiper :deep(img) {
  max-height: 80vh;
  height: auto;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}


.custom-swiper :deep(iframe) {
  max-height: 80vh;
  max-width: 100%;
  object-fit: contain; /* Keeps aspect ratio, no cropping */
  border-radius: 8px;
}


</style>
