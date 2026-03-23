<template>
  <div class="landing">
    <!-- Top hero removed (per request) -->

    <section class="section about">
      <div class="section-head">
        <h3>Polished games. Powerful templates.</h3>
      </div>
      <div class="about-card">
        <p>
          The Vayuputra is a game studio creating high-quality games and production-ready Unity templates for mobile and web. We focus on clean architecture, smooth user experience, and reliable performance, helping both players enjoy polished gameplay and developers build faster with easy-to-use, well-structured solutions.
        </p>        
    </div>
    </section>

    <section class="section works">
      <div class="section-head with-link">
        <h2>Featured Portfolio</h2>
        <router-link class="view-all" to="/game-projects">View all games</router-link>
      </div>

      <div class="portfolio-grid" v-if="featuredProjects.length > 0">
        <router-link
          v-for="project in featuredProjects"
          :key="project.id"
          class="portfolio-card"
          :to="`/game-projects/${project.id}`"
        >
          <img class="portfolio-image" :src="project.iconSrc" :alt="project.name" loading="lazy" />
          <div class="portfolio-overlay">
            <div class="work-name">{{ project.name }}</div>
          </div>
        </router-link>
      </div>

      <div v-else class="works-empty">
        Loading featured projects...
      </div>
    </section>
    <section class="section cta">
      <div class="cta-card">
        <div class="section-head">
          <h2>Let’s create your next hit game.</h2>
        </div>
        <p>
          Looking for a team to build, polish, or optimize your game? Reach out and we can discuss scope, timeline, and execution.
        </p>
        <div class="cta-actions">
          <a class="btn primary" href="mailto:vayuputra.developer@gmail.com">vayuputra.developer@gmail.com</a>
          <router-link class="btn outline" to="/contact">Contact Page</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface FeaturedProject {
  id: string;
  name: string;
  iconSrc: string;
  shortDescription?: string;
}

export default defineComponent({
  name: 'LandingView',
  data() {
    return {
      featuredProjects: [] as FeaturedProject[]
    };
  },
  async created() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}projectList.json`);
      const projectList = await response.json();
      const gameProjects = Array.isArray(projectList.gameProjects) ? projectList.gameProjects : [];

      const selected = gameProjects.slice(0, 3);
      const resolved = await Promise.all(
        selected.map(async (projectInfo: { id: string; baseUrl?: string }) => {
          const baseUrl = projectInfo.baseUrl || projectList.baseUrl;
          try {
            const projectResponse = await fetch(`${baseUrl}${projectInfo.id}/data.json`);
            if (!projectResponse.ok) return null;
            const projectData = await projectResponse.json();
            return {
              id: projectData.id || projectInfo.id,
              name: projectData.name || projectInfo.id,
              iconSrc: this.resolveImage(baseUrl, projectInfo.id, projectData.iconUrl),
              shortDescription: projectData.shortDescription
            } as FeaturedProject;
          } catch {
            return null;
          }
        })
      );

      this.featuredProjects = resolved.filter(Boolean) as FeaturedProject[];
    } catch {
      // Keep page usable even if remote data fails.
    }
  },
  methods: {
    resolveImage(baseUrl: string, projectId: string, iconUrl: string) {
      const path = (iconUrl || '').trim();
      if (!path) return '';
      if (path.startsWith('http')) return path;
      if (path.startsWith('/')) return path;
      const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      return `${normalizedBase}${projectId}/${path}`;
    }
  }
});
</script>

<style scoped lang="less">
@import '../css/variables.less';

.landing {
  max-width: 1240px;
  margin: 0 auto 60px auto;
}

.hero {
  position: relative;
  overflow: hidden;
  margin: 18px 0 30px 0;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 520px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/img/1709191437917.png');
  background-size: cover;
  background-position: center;
  filter: saturate(105%) contrast(110%);
  transform: scale(1.04);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, rgba(4, 10, 24, 0.88) 35%, rgba(6, 24, 46, 0.64) 60%, rgba(6, 24, 46, 0.82) 100%);
}

.scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.1;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.15) 1px,
    transparent 2px,
    transparent 5px
  );
}

.hero-inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 22px;
  align-items: center;
  min-height: 520px;
  padding: 34px;
}

.kicker {
  text-transform: uppercase;
  letter-spacing: 0.13em;
  font-size: 0.86em;
  font-weight: 700;
  opacity: 0.82;
}

.headline {
  margin: 14px 0;
  font-size: 3.35em;
  line-height: 1;
  font-weight: 900;
  max-width: 760px;
}

.subhead {
  max-width: 680px;
  opacity: 0.88;
  font-size: 1.07em;
}

.hero-cta {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid transparent;
  font-weight: 700;
  opacity: 1;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #5665ff, #00bcd4);
  color: #fff;
  box-shadow: 0 8px 32px rgba(86, 101, 255, 0.28);
}

.btn.outline {
  color: @textColor;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.btn:hover {
  transform: translateY(-2px);
}

.hero-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.brand-card {
  position: relative;
  width: 100%;
  max-width: 330px;
  aspect-ratio: 1/1;
  border-radius: 20px;
  background: rgba(8, 18, 36, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.hero-logo {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 18px;
}

.brand-glow {
  position: absolute;
  inset: -30%;
  background: radial-gradient(circle, rgba(0, 188, 212, 0.28), rgba(86, 101, 255, 0.14), transparent 60%);
  filter: blur(10px);
}

.hero-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92em;
  opacity: 0.84;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #00bcd4;
  box-shadow: 0 0 14px rgba(0, 188, 212, 0.4);
}

.stats-strip {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat {
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.015));
}

.num {
  font-size: 1.5em;
  font-weight: 900;
}

.label {
  opacity: 0.78;
  margin-top: 3px;
  font-size: 0.92em;
}

.section {
  margin-top: 34px;
}

.section-head h2 {
  margin: 0 0 12px 0;
  font-size: 1.8em;
}

.about-card {
  border-radius: 16px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.about-card p {
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.about-card p:last-child {
  margin-bottom: 0;
}

.about-list {
  margin-top: 14px;
}

.point {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.point:last-child {
  border-bottom: 0;
}

.with-link {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
}

.view-all {
  text-decoration: underline;
}

.portfolio-grid {
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.portfolio-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  min-height: 250px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.portfolio-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 250px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  opacity: 1;
  filter: brightness(1) saturate(112%) contrast(108%);
}

.portfolio-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px;
  z-index: 2;
  background: linear-gradient(180deg, rgba(12, 63, 173, 0), rgba(7, 17, 38, 0.22));
  z-index: 2;
}

.portfolio-card:hover .portfolio-image {
  transform: scale(1.05);
}

.work-name {
  font-weight: 800;
  font-size: 1.1em;
  color: @textColor;
  text-shadow: 0 0 18px rgba(0, 0, 0, 0.65);
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(7, 17, 38, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
}

.works-empty {
  padding: 16px;
  opacity: 0.75;
}

.value-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.value-card {
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.value-card h3 {
  margin: 0 0 8px 0;
}

.value-card p {
  margin: 0;
  opacity: 0.82;
}

.cta-card {
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(145deg, rgba(86, 101, 255, 0.17), rgba(0, 188, 212, 0.08));
}

.cta-card p {
  max-width: 760px;
  opacity: 0.9;
}

.cta-actions {
  margin-top: 14px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media only screen and (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    min-height: unset;
  }

  .hero-right {
    align-items: flex-start;
  }

  .stats-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .portfolio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .value-strip {
    grid-template-columns: 1fr;
  }
}

@media only screen and (max-width: 640px) {
  .hero {
    min-height: auto;
  }

  .hero-inner {
    padding: 20px;
  }

  .headline {
    font-size: 2.35em;
  }

  .stats-strip {
    grid-template-columns: 1fr;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }
}
</style>

